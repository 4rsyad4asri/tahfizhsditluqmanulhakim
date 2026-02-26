import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { generateMockData, calculateNilaiSetoran, calculateNilaiUjian, SURAH_LIST } from "@/data/mockData";
import type { Student, Setoran, Koreksi, Ujian } from "@/data/mockData";
import { ArrowLeft, Plus, FileText, Award, BookOpen, PenLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockData = generateMockData();

const StudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const studentData = useMemo(() => {
    for (const c of mockData) {
      const s = c.students.find(st => st.id === studentId);
      if (s) return { student: s, className: c.name, classGrade: c.grade, classSection: c.section };
    }
    return null;
  }, [studentId]);

  const [student, setStudent] = useState<Student | null>(studentData?.student || null);
  const [catatan, setCatatan] = useState(student?.catatanPenguji || "");

  // Setoran form state
  const [showSetoranForm, setShowSetoranForm] = useState(false);
  const [setoranForm, setSetoranForm] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    juz: 30,
    surah: "Al-Fatihah",
    ayatMulai: 1,
    ayatAkhir: 7,
    koreksi: { kesalahanMakhraj: 0, kesalahanTajwid: 0, kesalahanMad: 0, kelancaran: 8 } as Koreksi,
  });

  // Ujian form state
  const [showUjianForm, setShowUjianForm] = useState(false);
  const [ujianMode, setUjianMode] = useState<'Tahsin' | 'Tahfizh'>('Tahsin');
  const [ujianAspek, setUjianAspek] = useState<Record<string, number>>({});

  if (!student || !studentData) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Siswa tidak ditemukan</div>;
  }

  const handleAddSetoran = () => {
    const nilai = calculateNilaiSetoran(setoranForm.koreksi);
    const newSetoran: Setoran = {
      id: `setoran-${Date.now()}`,
      tanggal: setoranForm.tanggal,
      juz: setoranForm.juz,
      surah: setoranForm.surah,
      ayatMulai: setoranForm.ayatMulai,
      ayatAkhir: setoranForm.ayatAkhir,
      nilai,
      koreksi: { ...setoranForm.koreksi },
    };
    setStudent({ ...student, setoran: [...student.setoran, newSetoran] });
    setShowSetoranForm(false);
  };

  const tahsinAspek = ['Makharijul Huruf', 'Tajwid', 'Kelancaran', 'Adab Membaca'];
  const tahfizhAspek = ['Kelancaran Hafalan', 'Ketepatan Ayat', 'Tajwid', 'Kekuatan Ingatan'];

  const handleUjianSubmit = () => {
    const { nilaiAkhir, status, grade } = calculateNilaiUjian(ujianAspek);
    const newUjian: Ujian = {
      id: `ujian-${Date.now()}`,
      tanggal: new Date().toISOString().split("T")[0],
      mode: ujianMode,
      nilaiAspek: { ...ujianAspek },
      nilaiAkhir,
      status,
      grade,
    };
    setStudent({
      ...student,
      ujian: [...student.ujian, newUjian],
      statusSertifikasi: status,
    });
    setShowUjianForm(false);
    setUjianAspek({});
  };

  const nilaiPreview = Object.keys(ujianAspek).length > 0 ? calculateNilaiUjian(ujianAspek) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(`/kelas/${studentData.classGrade}${studentData.classSection}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke {studentData.className}
        </button>

        {/* Student Info Card */}
        <div className="bg-card rounded-lg border border-border shadow-card p-6 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{studentData.className} · Target Juz {student.targetJuz}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.level === 'Tahfizh' ? 'bg-primary/10 text-primary' :
                  student.level === 'Tahsin Lanjutan' ? 'bg-accent/10 text-accent' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {student.level}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.statusSertifikasi === 'Lulus' ? 'bg-success/10 text-success' :
                  student.statusSertifikasi === 'Tidak Lulus' ? 'bg-destructive/10 text-destructive' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {student.statusSertifikasi === 'Lulus' ? '✅' : student.statusSertifikasi === 'Tidak Lulus' ? '❌' : '⏳'} {student.statusSertifikasi}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                    strokeDasharray={`${student.progressHafalan * 2.136} 213.6`}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                  {student.progressHafalan}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Progress</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="setoran" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="setoran" className="flex items-center gap-1.5 text-xs md:text-sm">
              <BookOpen className="w-3.5 h-3.5" />Setoran
            </TabsTrigger>
            <TabsTrigger value="ujian" className="flex items-center gap-1.5 text-xs md:text-sm">
              <Award className="w-3.5 h-3.5" />Ujian
            </TabsTrigger>
            <TabsTrigger value="catatan" className="flex items-center gap-1.5 text-xs md:text-sm">
              <PenLine className="w-3.5 h-3.5" />Catatan
            </TabsTrigger>
          </TabsList>

          {/* SETORAN TAB */}
          <TabsContent value="setoran" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Riwayat Setoran</h3>
              <button
                onClick={() => setShowSetoranForm(!showSetoranForm)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium gradient-islamic text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Setoran
              </button>
            </div>

            {showSetoranForm && (
              <div className="bg-card rounded-lg border border-border p-5 shadow-card animate-scale-in space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Form Input Setoran Hafalan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Tanggal</label>
                    <input type="date" value={setoranForm.tanggal}
                      onChange={e => setSetoranForm({ ...setoranForm, tanggal: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Juz</label>
                    <select value={setoranForm.juz}
                      onChange={e => setSetoranForm({ ...setoranForm, juz: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                        <option key={j} value={j}>Juz {j}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Surah</label>
                    <select value={setoranForm.surah}
                      onChange={e => setSetoranForm({ ...setoranForm, surah: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {SURAH_LIST.map(s => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Ayat Mulai</label>
                      <input type="number" min={1} value={setoranForm.ayatMulai}
                        onChange={e => setSetoranForm({ ...setoranForm, ayatMulai: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Ayat Akhir</label>
                      <input type="number" min={1} value={setoranForm.ayatAkhir}
                        onChange={e => setSetoranForm({ ...setoranForm, ayatAkhir: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                </div>

                {/* Koreksi Penguji */}
                <div className="pt-2 border-t border-border">
                  <h5 className="text-sm font-semibold text-foreground mb-3">Koreksi Penguji</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'kesalahanMakhraj', label: 'Kesalahan Makhraj' },
                      { key: 'kesalahanTajwid', label: 'Kesalahan Tajwid' },
                      { key: 'kesalahanMad', label: 'Kesalahan Mad' },
                      { key: 'kelancaran', label: 'Kelancaran (1-10)' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">{field.label}</label>
                        <input type="number" min={0} max={field.key === 'kelancaran' ? 10 : 50}
                          value={(setoranForm.koreksi as any)[field.key]}
                          onChange={e => setSetoranForm({
                            ...setoranForm,
                            koreksi: { ...setoranForm.koreksi, [field.key]: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground">
                      Nilai Otomatis: <span className="text-lg font-bold text-primary">{calculateNilaiSetoran(setoranForm.koreksi)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowSetoranForm(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                    Batal
                  </button>
                  <button onClick={handleAddSetoran}
                    className="px-4 py-2 rounded-md text-sm font-medium gradient-islamic text-primary-foreground hover:opacity-90 transition-opacity">
                    Simpan Setoran
                  </button>
                </div>
              </div>
            )}

            {/* Setoran List */}
            <div className="space-y-3">
              {student.setoran.map((s) => (
                <div key={s.id} className="bg-card rounded-lg border border-border p-4 shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{s.surah} (Ayat {s.ayatMulai}-{s.ayatAkhir})</p>
                      <p className="text-xs text-muted-foreground">Juz {s.juz} · {s.tanggal}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${s.nilai >= 80 ? 'text-success' : s.nilai >= 60 ? 'text-warning' : 'text-destructive'}`}>
                          {s.nilai}
                        </p>
                        <p className="text-xs text-muted-foreground">Nilai</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <span>Makhraj: {s.koreksi.kesalahanMakhraj}</span>
                    <span>Tajwid: {s.koreksi.kesalahanTajwid}</span>
                    <span>Mad: {s.koreksi.kesalahanMad}</span>
                    <span>Lancar: {s.koreksi.kelancaran}/10</span>
                  </div>
                </div>
              ))}
              {student.setoran.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Belum ada setoran</p>
              )}
            </div>
          </TabsContent>

          {/* UJIAN TAB */}
          <TabsContent value="ujian" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Ujian Sertifikasi</h3>
              <button
                onClick={() => { setShowUjianForm(!showUjianForm); setUjianAspek({}); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium gradient-islamic text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                Mulai Ujian
              </button>
            </div>

            {showUjianForm && (
              <div className="bg-card rounded-lg border border-border p-5 shadow-card animate-scale-in space-y-4">
                <h4 className="font-semibold text-foreground">Form Ujian Sertifikasi</h4>

                {/* Mode selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setUjianMode('Tahsin'); setUjianAspek({}); }}
                    className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                      ujianMode === 'Tahsin' ? 'gradient-islamic text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    🟢 Ujian Tahsin
                  </button>
                  <button
                    onClick={() => { setUjianMode('Tahfizh'); setUjianAspek({}); }}
                    className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                      ujianMode === 'Tahfizh' ? 'gradient-islamic text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    🔵 Ujian Tahfizh
                  </button>
                </div>

                {/* Aspek penilaian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(ujianMode === 'Tahsin' ? tahsinAspek : tahfizhAspek).map(aspek => (
                    <div key={aspek}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{aspek}</label>
                      <input type="number" min={0} max={100}
                        value={ujianAspek[aspek] || ''}
                        placeholder="0-100"
                        onChange={e => setUjianAspek({ ...ujianAspek, [aspek]: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  ))}
                </div>

                {/* Preview nilai */}
                {nilaiPreview && (
                  <div className={`p-4 rounded-md ${nilaiPreview.status === 'Lulus' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Nilai Akhir</p>
                        <p className="text-3xl font-bold text-foreground">{nilaiPreview.nilaiAkhir}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${nilaiPreview.status === 'Lulus' ? 'text-success' : 'text-destructive'}`}>
                          Grade {nilaiPreview.grade}
                        </p>
                        <p className="text-sm font-medium">
                          {nilaiPreview.status === 'Lulus' ? '✅ LULUS' : '❌ TIDAK LULUS'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowUjianForm(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                    Batal
                  </button>
                  <button onClick={handleUjianSubmit}
                    disabled={Object.keys(ujianAspek).length < 4}
                    className="px-4 py-2 rounded-md text-sm font-medium gradient-islamic text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                    Simpan Hasil Ujian
                  </button>
                </div>
              </div>
            )}

            {/* Ujian History */}
            <div className="space-y-3">
              {student.ujian.map((u) => (
                <div key={u.id} className={`bg-card rounded-lg border p-4 shadow-card ${u.status === 'Lulus' ? 'border-success/30' : 'border-destructive/30'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">Ujian {u.mode}</p>
                      <p className="text-xs text-muted-foreground">{u.tanggal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{u.nilaiAkhir}</p>
                      <p className={`text-xs font-medium ${u.status === 'Lulus' ? 'text-success' : 'text-destructive'}`}>
                        Grade {u.grade} · {u.status === 'Lulus' ? '✅ Lulus' : '❌ Tidak Lulus'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(u.nilaiAspek).map(([key, val]) => (
                      <div key={key} className="text-center p-2 rounded-md bg-muted">
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="font-bold text-foreground">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {student.ujian.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Belum ada ujian</p>
              )}
            </div>
          </TabsContent>

          {/* CATATAN TAB */}
          <TabsContent value="catatan" className="space-y-4">
            <h3 className="font-semibold text-foreground">Catatan Penguji</h3>
            <textarea
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Tulis catatan, evaluasi, dan saran perbaikan untuk siswa..."
              className="w-full min-h-[200px] px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <button
              onClick={() => setStudent({ ...student, catatanPenguji: catatan })}
              className="px-4 py-2 rounded-md text-sm font-medium gradient-islamic text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Simpan Catatan
            </button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDetail;
