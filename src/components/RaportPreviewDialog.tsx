import { useRef, useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, Settings2, Loader2, X, Upload, ImageIcon } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  calculateNilaiTahsinDasar,
  calculateNilaiTahsinLanjutan,
  type TahsinDasarEntry,
  type TahsinLanjutanEntry,
  type TahsinPenaltyConfig,
  type WaqafSymbolTest,
} from "@/data/tahsinScoring";
import { calculateNilaiSurahWithRumus, type TahfizhSurahEntry } from "@/data/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
  ujian: any;
  studentName: string;
  className: string;
  assessorName?: string;
}

const DEFAULT_HEADER = {
  schoolName: "SDIT Luqmanul Hakim",
  programName: "Program Tahfizh & Tahsin Al-Qur'an",
  address: "Jl. Pendidikan No. 1, Indonesia",
  headmaster: "Miftahul Arsyad Asri, S.H",
  headmasterTitle: "Kepala Sekolah",
  nip: "-",
  city: "Jakarta",
  examinerTitle: "Koordinator Tahfizh",
};

const STORAGE_KEY = "raport_settings_v1";
const FONT_OPTIONS = ["Inter", "Poppins", "Roboto", "Plus Jakarta Sans"];

type Orientation = "portrait" | "landscape";
type Align = "left" | "center" | "right";

interface Assets {
  logoLeft?: string;
  logoRight?: string;
  watermark?: string;
  sigExaminer?: string;
  sigHeadmaster?: string;
}

interface Settings {
  font: string;
  fontSize: number;
  tableFontSize: number;
  cellAlign: Align;
  wrapText: boolean;
  logoSize: number;
  showWatermark: boolean;
  orientation: Orientation;
}

const DEFAULT_SETTINGS: Settings = {
  font: "Inter",
  fontSize: 12,
  tableFontSize: 11,
  cellAlign: "center",
  wrapText: true,
  logoSize: 64,
  showWatermark: false,
  orientation: "portrait",
};

export default function RaportPreviewDialog({
  open, onClose, ujian, studentName, className, assessorName,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [catatanRapor, setCatatanRapor] = useState<string>(ujian?.nilai_aspek?.catatanGuru || "");
  const [tanggalRapor, setTanggalRapor] = useState<string>(
    ujian?.tanggal || new Date().toISOString().split("T")[0]
  );
  const [assets, setAssets] = useState<Assets>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load persisted assets/settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        if (parsed.header) setHeader((h) => ({ ...h, ...parsed.header }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, settings, header }));
    } catch {}
  }, [assets, settings, header]);

  const mode = ujian?.mode as "Tahfizh" | "Tahsin Dasar" | "Tahsin Lanjutan";
  const aspek = ujian?.nilai_aspek || {};
  const predikat = aspek.predikat || (ujian?.nilai_akhir >= 90 ? "Mumtaz" : ujian?.nilai_akhir >= 80 ? "Jiddan Jayyid" : ujian?.nilai_akhir >= 70 ? "Jayyid" : "Perlu Perbaikan");

  const tanggalFmt = useMemo(
    () => new Date(tanggalRapor).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    [tanggalRapor]
  );

  const onUpload = (key: keyof Assets) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2_000_000) { toast.error("Ukuran file maksimal 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setAssets((a) => ({ ...a, [key]: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const validate = () => {
    if (!ujian?.nilai_akhir && ujian?.nilai_akhir !== 0) {
      toast.warning("Data nilai kosong, tetap diekspor.");
    }
    return true;
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    if (!validate()) return;
    setExporting(true);
    try {
      // Render full HTML to canvas
      const canvas = await html2canvas(printRef.current, {
        scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      });
      const pdf = new jsPDF({ orientation: settings.orientation, unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      // Px per mm based on canvas width matching pdfW
      const pxPerMm = canvas.width / pdfW;
      const pageHeightPx = Math.floor(pdfH * pxPerMm);
      let renderedPx = 0;
      let pageIdx = 0;
      while (renderedPx < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedPx);
        // Slice canvas onto a temporary canvas for this page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, renderedPx, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
        if (pageIdx > 0) pdf.addPage();
        const sliceMm = sliceHeight / pxPerMm;
        pdf.addImage(imgData, "JPEG", 0, 0, pdfW, sliceMm);
        renderedPx += sliceHeight;
        pageIdx++;
      }
      pdf.save(`Raport_${mode.replace(/\s+/g, "_")}_${studentName.replace(/\s+/g, "_")}.pdf`);
      toast.success("Raport berhasil diunduh");
    } catch (e: any) {
      toast.error("Gagal export PDF: " + (e.message || ""));
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((n) => n.outerHTML).join("\n");
    w.document.write(`<html><head><title>Raport ${studentName}</title>
      ${styles}
      <style>
        body{margin:0;font-family:'${settings.font}',system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        @page { size: A4 ${settings.orientation}; margin: 0; }
        table { page-break-inside: auto; }
        tr, .no-break { page-break-inside: avoid; }
        .signature-block, .catatan-block { page-break-inside: avoid; }
      </style>
      </head><body>${printRef.current.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  const pageStyle: React.CSSProperties = {
    width: settings.orientation === "portrait" ? "210mm" : "297mm",
    minHeight: settings.orientation === "portrait" ? "297mm" : "210mm",
    padding: "16mm",
    fontFamily: `'${settings.font}', system-ui, sans-serif`,
    fontSize: `${settings.fontSize}px`,
    position: "relative",
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Raport Ujian {mode}</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center justify-between border-b pb-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
              <Settings2 className="w-4 h-4 mr-1" /> {editing ? "Tutup Editor" : "Editor Raport"}
            </Button>
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={settings.orientation}
              onChange={(e) => setSettings({ ...settings, orientation: e.target.value as Orientation })}
            >
              <option value="portrait">A4 Portrait</option>
              <option value="landscape">A4 Landscape</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> Cetak
            </Button>
            <Button size="sm" onClick={handleExportPDF} disabled={exporting}>
              {exporting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Edit panel */}
        {editing && (
          <div className="space-y-4 p-3 rounded-md bg-muted/50 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nama Sekolah</Label>
              <Input value={header.schoolName} onChange={(e) => setHeader({ ...header, schoolName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Program</Label>
              <Input value={header.programName} onChange={(e) => setHeader({ ...header, programName: e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Alamat Sekolah</Label>
              <Input value={header.address} onChange={(e) => setHeader({ ...header, address: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kepala Sekolah</Label>
              <Input value={header.headmaster} onChange={(e) => setHeader({ ...header, headmaster: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">NIP</Label>
              <Input value={header.nip} onChange={(e) => setHeader({ ...header, nip: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Jabatan Penguji</Label>
              <Input value={header.examinerTitle} onChange={(e) => setHeader({ ...header, examinerTitle: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kota</Label>
              <Input value={header.city} onChange={(e) => setHeader({ ...header, city: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tanggal Raport</Label>
              <Input type="date" value={tanggalRapor} onChange={(e) => setTanggalRapor(e.target.value)} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Catatan / Komentar Guru di Raport</Label>
              <Textarea rows={3} value={catatanRapor} onChange={(e) => setCatatanRapor(e.target.value)} />
            </div>
            </div>

            {/* Typography & table controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
              <div className="space-y-1">
                <Label className="text-xs">Font</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={settings.font}
                  onChange={(e) => setSettings({ ...settings, font: e.target.value })}
                >
                  {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ukuran Body ({settings.fontSize}px)</Label>
                <Input type="range" min={9} max={16} value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ukuran Tabel ({settings.tableFontSize}px)</Label>
                <Input type="range" min={8} max={14} value={settings.tableFontSize}
                  onChange={(e) => setSettings({ ...settings, tableFontSize: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Alignment Cell</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={settings.cellAlign}
                  onChange={(e) => setSettings({ ...settings, cellAlign: e.target.value as Align })}
                >
                  <option value="left">Kiri</option>
                  <option value="center">Tengah</option>
                  <option value="right">Kanan</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-2 col-span-2">
                <Label className="text-xs">Wrap Text</Label>
                <Switch checked={settings.wrapText} onCheckedChange={(v) => setSettings({ ...settings, wrapText: v })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Ukuran Logo ({settings.logoSize}px)</Label>
                <Input type="range" min={40} max={120} value={settings.logoSize}
                  onChange={(e) => setSettings({ ...settings, logoSize: Number(e.target.value) })} />
              </div>
            </div>

            {/* Asset uploads */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t">
              {([
                ["logoLeft", "Logo Kiri (Sekolah)"],
                ["logoRight", "Logo Kanan (Yayasan)"],
                ["sigExaminer", "TTD Penguji"],
                ["sigHeadmaster", "TTD Kepsek"],
                ["watermark", "Watermark"],
              ] as [keyof Assets, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer inline-flex items-center justify-center h-9 px-2 rounded-md border border-input bg-background hover:bg-accent text-xs">
                      {assets[key] ? <ImageIcon className="w-3 h-3 mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                      {assets[key] ? "Ganti" : "Upload"}
                      <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onUpload(key)} />
                    </label>
                    {assets[key] && (
                      <button type="button" className="h-9 w-9 rounded-md border border-input hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                        onClick={() => setAssets((a) => ({ ...a, [key]: undefined }))} title="Hapus">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {assets[key] && (
                    <img src={assets[key]} alt={label} className="h-10 mt-1 object-contain bg-white border rounded" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Label className="text-xs">Tampilkan Watermark</Label>
              <Switch checked={settings.showWatermark} onCheckedChange={(v) => setSettings({ ...settings, showWatermark: v })} />
            </div>
          </div>
        )}

        {/* Raport content (A4 portrait) */}
        <div className="overflow-x-auto">
          <div
            ref={printRef}
            className="mx-auto bg-white text-gray-900"
            style={pageStyle}
          >
            {/* Watermark */}
            {settings.showWatermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                {assets.watermark ? (
                  <img src={assets.watermark} alt="watermark" style={{ maxWidth: "60%", opacity: 0.08 }} />
                ) : (
                  <span style={{ fontSize: "120px", color: "rgba(6,95,70,0.07)", fontWeight: 800, transform: "rotate(-30deg)" }}>
                    {header.schoolName}
                  </span>
                )}
              </div>
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-emerald-700 pb-3">
              <div className="flex items-center justify-center" style={{ width: settings.logoSize, height: settings.logoSize }}>
                {assets.logoLeft ? (
                  <img src={assets.logoLeft} alt="logo kiri" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                  <div className="w-full h-full rounded-full border-2 border-emerald-700 flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-xs text-center leading-tight">SDIT<br/>LH</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold text-emerald-800 uppercase tracking-wide">{header.schoolName}</h1>
                <p className="text-sm text-emerald-700 font-medium">{header.programName}</p>
                <p className="text-[10px] text-gray-600">{header.address}</p>
              </div>
              <div className="flex items-center justify-center" style={{ width: settings.logoSize, height: settings.logoSize }}>
                {assets.logoRight ? (
                  <img src={assets.logoRight} alt="logo kanan" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                  <div className="w-full h-full rounded-full border-2 border-amber-600 flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-[10px]">قرآن</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-5">
              <h2 className="text-lg font-bold text-gray-800 tracking-widest">RAPOR HASIL UJIAN</h2>
              <p className="text-base font-semibold text-emerald-700">
                {mode === "Tahfizh" ? "SERTIFIKASI TAHFIZH AL-QUR'AN" : `UJIAN ${mode.toUpperCase()}`}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">No. Dok: RPT/{mode.replace(/\s+/g, "")}/{ujian?.id?.slice(0, 6).toUpperCase()}</p>
            </div>

            {/* Student Info */}
            <table className="w-full mb-4 border border-gray-300 no-break" style={{ fontSize: settings.fontSize, borderCollapse: "collapse" }}>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1.5 bg-emerald-50 font-medium w-1/4">Nama Siswa</td>
                  <td className="px-3 py-1.5">{studentName}</td>
                  <td className="px-3 py-1.5 bg-emerald-50 font-medium w-1/4">Kelas</td>
                  <td className="px-3 py-1.5">{className}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 bg-emerald-50 font-medium">Penguji</td>
                  <td className="px-3 py-1.5">{assessorName || "-"}</td>
                  <td className="px-3 py-1.5 bg-emerald-50 font-medium">Tanggal Ujian</td>
                  <td className="px-3 py-1.5">{tanggalFmt}</td>
                </tr>
              </tbody>
            </table>

            {/* Score summary */}
            <div className="grid grid-cols-3 gap-3 mb-4 no-break">
              <div className="border-2 border-emerald-700 rounded-md p-3 text-center bg-emerald-50">
                <p className="text-[10px] text-gray-600 uppercase">Nilai Akhir</p>
                <p className="text-3xl font-bold text-emerald-800">{ujian?.nilai_akhir}</p>
              </div>
              <div className="border-2 border-amber-600 rounded-md p-3 text-center bg-amber-50">
                <p className="text-[10px] text-gray-600 uppercase">Grade</p>
                <p className="text-3xl font-bold text-amber-700">{ujian?.grade}</p>
              </div>
              <div className={`border-2 rounded-md p-3 text-center ${ujian?.status === "Lulus" ? "border-emerald-700 bg-emerald-50" : "border-red-600 bg-red-50"}`}>
                <p className="text-[10px] text-gray-600 uppercase">Status</p>
                <p className={`text-2xl font-bold mt-1 ${ujian?.status === "Lulus" ? "text-emerald-800" : "text-red-700"}`}>
                  {ujian?.status === "Lulus" ? "✓ LULUS" : "✗ T. LULUS"}
                </p>
                <p className="text-[10px] text-gray-700">Predikat: <strong>{predikat}</strong></p>
              </div>
            </div>

            {/* Detail per mode */}
            {mode === "Tahfizh" && Array.isArray(aspek.surahEntries) && (
              <DetailTahfizh entries={aspek.surahEntries as TahfizhSurahEntry[]} settings={settings} />
            )}
            {mode === "Tahsin Dasar" && Array.isArray(aspek.entries) && (
              <DetailTahsinDasar entries={aspek.entries as TahsinDasarEntry[]} config={aspek.config} settings={settings} />
            )}
            {mode === "Tahsin Lanjutan" && Array.isArray(aspek.entries) && (
              <DetailTahsinLanjutan
                entries={aspek.entries as TahsinLanjutanEntry[]}
                config={aspek.config}
                penaltiWaqaf={aspek.penaltiWaqaf || 2}
                waqafTest={aspek.waqafTest}
                settings={settings}
              />
            )}

            {/* Catatan */}
            <div className="mt-4 border border-gray-300 rounded-md catatan-block">
              <div className="bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5">CATATAN GURU / PENGUJI</div>
              <div className="p-3 min-h-[60px]" style={{ fontSize: settings.fontSize, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
                {catatanRapor || "—"}
              </div>
            </div>

            {/* Signature */}
            <div className="grid grid-cols-2 gap-6 mt-8 signature-block" style={{ fontSize: settings.fontSize }}>
              <div className="text-center">
                <p>Penguji,</p>
                <div className="h-20 flex items-center justify-center">
                  {assets.sigExaminer && <img src={assets.sigExaminer} alt="ttd penguji" style={{ maxHeight: "70px", objectFit: "contain" }} />}
                </div>
                <p className="font-semibold underline">{assessorName || "(........................)"}</p>
                <p className="text-xs text-gray-600">{header.examinerTitle}</p>
              </div>
              <div className="text-center">
                <p>{header.city}, {tanggalFmt}</p>
                <p>{header.headmasterTitle},</p>
                <div className="h-20 flex items-center justify-center">
                  {assets.sigHeadmaster && <img src={assets.sigHeadmaster} alt="ttd kepsek" style={{ maxHeight: "70px", objectFit: "contain" }} />}
                </div>
                <p className="font-semibold underline">{header.headmaster}</p>
                <p className="text-xs text-gray-600">NIP: {header.nip}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[10px] text-gray-500">
              Dokumen ini dikeluarkan secara resmi oleh {header.schoolName} — {header.programName}
            </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Detail Tables ---------- */

function tableStyle(settings: Settings): React.CSSProperties {
  return {
    fontSize: settings.tableFontSize,
    borderCollapse: "collapse",
    width: "100%",
    tableLayout: "auto",
  };
}
function cellStyle(settings: Settings, override?: Align): React.CSSProperties {
  return {
    textAlign: override || settings.cellAlign,
    whiteSpace: settings.wrapText ? "normal" : "nowrap",
    wordBreak: settings.wrapText ? "break-word" : "normal",
    padding: "4px 6px",
    border: "1px solid #d1d5db",
  };
}

function DetailTahfizh({ entries, settings }: { entries: TahfizhSurahEntry[]; settings: Settings }) {
  return (
    <div className="no-break">
      <h3 className="text-sm font-bold text-emerald-800 mb-2 border-l-4 border-amber-600 pl-2">DETAIL UJIAN SERTIFIKASI TAHFIZH</h3>
      <table style={tableStyle(settings)}>
        <thead>
          <tr className="bg-emerald-700 text-white">
            <th style={{ ...cellStyle(settings, "left"), fontWeight: 700 }}>Surat</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Juz</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Lahn Jali</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Lahn Khofi</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Waqaf</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Sambung</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Lancar</th>
            <th style={{ ...cellStyle(settings), fontWeight: 700 }}>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/40"}>
              <td style={{ ...cellStyle(settings, "left"), fontWeight: 500 }}>{e.surah}</td>
              <td style={cellStyle(settings)}>{e.juz}</td>
              <td style={cellStyle(settings)}>{e.lahn_jali}</td>
              <td style={cellStyle(settings)}>{e.lahn_khofi}</td>
              <td style={cellStyle(settings)}>{e.waqaf_ibtida ?? 0}</td>
              <td style={cellStyle(settings)}>{e.salah_sambung_ayat ?? 0}</td>
              <td style={cellStyle(settings)}>{e.kelancaran}</td>
              <td style={{ ...cellStyle(settings), fontWeight: 700, color: "#047857" }}>{calculateNilaiSurahWithRumus(e, "baru")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-gray-500 mt-1 italic">Rumus: Nilai = Kelancaran − (LJ×2) − (LK×1) − (Waqaf×2) − (Sambung×2)</p>
    </div>
  );
}

function DetailTahsinDasar({ entries, config, settings }: { entries: TahsinDasarEntry[]; config?: TahsinPenaltyConfig; settings: Settings }) {
  const cfg = config || { penalti_lahn_jali: 2, penalti_lahn_khofi: 1, bobot_kelancaran: 40 };
  const headers = ["EBTA","S.Huruf","S.Harakat","S.Tasydid","Mad","Ghunnah","Tajwid","Waqaf","Lancar","Nilai"];
  return (
    <div className="no-break">
      <h3 className="text-sm font-bold text-emerald-800 mb-2 border-l-4 border-amber-600 pl-2">DETAIL UJIAN TAHSIN DASAR</h3>
      <table style={tableStyle(settings)}>
        <thead>
          <tr className="bg-emerald-700 text-white">
            {headers.map((h, idx) => (
              <th key={h} style={{ ...cellStyle(settings, idx === 0 ? "left" : settings.cellAlign), fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/40"}>
              <td style={{ ...cellStyle(settings, "left"), fontWeight: 500 }}>{e.nama_ebta}</td>
              <td style={cellStyle(settings)}>{e.salah_huruf}</td>
              <td style={cellStyle(settings)}>{e.salah_harakat}</td>
              <td style={cellStyle(settings)}>{e.salah_makhraj}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_mad}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_ghunnah}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_tajwid}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_waqaf}</td>
              <td style={cellStyle(settings)}>{e.kelancaran}</td>
              <td style={{ ...cellStyle(settings), fontWeight: 700, color: "#047857" }}>{calculateNilaiTahsinDasar(e, cfg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-gray-500 mt-1 italic">Rumus: Nilai = Kelancaran − (LJ × {cfg.penalti_lahn_jali}) − (LK × {cfg.penalti_lahn_khofi})</p>
    </div>
  );
}

function DetailTahsinLanjutan({
  entries, config, penaltiWaqaf, waqafTest, settings,
}: { entries: TahsinLanjutanEntry[]; config?: TahsinPenaltyConfig; penaltiWaqaf: number; waqafTest?: WaqafSymbolTest; settings: Settings }) {
  const cfg = config || { penalti_lahn_jali: 2, penalti_lahn_khofi: 1, bobot_kelancaran: 40 };
  const waqafLabels: Record<string, string> = {
    waqaf_lazim: "Waqaf Lazim (مـ)",
    waqaf_mustahab: "Waqaf Mustahab (قلى)",
    waqaf_jaiz: "Waqaf Jaiz (ج)",
    waqaf_mujawwaz: "Waqaf Mujawwaz (صلى)",
    waqaf_mamnu: "Waqaf Mamnu' (لا)",
    washol_lazim: "Washol Lazim (∴)",
  };
  const headers = ["Surat","Ayat","S.Huruf","S.Harakat","S.Tasydid","Mad","Ghunnah","Tajwid","Waqaf","Lancar","Nilai"];
  return (
    <div className="no-break">
      <h3 className="text-sm font-bold text-emerald-800 mb-2 border-l-4 border-amber-600 pl-2">DETAIL UJIAN TAHSIN LANJUTAN</h3>
      <table style={tableStyle(settings)}>
        <thead>
          <tr className="bg-emerald-700 text-white">
            {headers.map((h, idx) => (
              <th key={h} style={{ ...cellStyle(settings, idx === 0 ? "left" : settings.cellAlign), fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/40"}>
              <td style={{ ...cellStyle(settings, "left"), fontWeight: 500 }}>{e.surah}</td>
              <td style={cellStyle(settings)}>{e.ayat}</td>
              <td style={cellStyle(settings)}>{e.salah_huruf}</td>
              <td style={cellStyle(settings)}>{e.salah_harakat}</td>
              <td style={cellStyle(settings)}>{e.salah_makhraj}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_mad}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_ghunnah}</td>
              <td style={cellStyle(settings)}>{e.kesalahan_tajwid}</td>
              <td style={cellStyle(settings)}>{e.waqaf_ibtida}</td>
              <td style={cellStyle(settings)}>{e.kelancaran}</td>
              <td style={{ ...cellStyle(settings), fontWeight: 700, color: "#047857" }}>{calculateNilaiTahsinLanjutan(e, cfg, penaltiWaqaf)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-gray-500 mt-1 italic">Rumus: Nilai = Kelancaran − (LJ × {cfg.penalti_lahn_jali}) − (LK × {cfg.penalti_lahn_khofi}) − (Waqaf × {penaltiWaqaf})</p>

      {waqafTest && (
        <div className="mt-3 border border-gray-300 rounded-md overflow-hidden no-break">
          <div className="bg-amber-600 text-white text-xs font-semibold px-3 py-1.5">TES SIMBOL WAQAF</div>
          <div className="grid grid-cols-2 gap-1 p-2 text-[11px]">
            {Object.entries(waqafTest).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-dashed border-gray-200 py-0.5">
                <span>{waqafLabels[k] || k}</span>
                <span className={v ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>{v ? "✓ Benar" : "✗ Salah"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}