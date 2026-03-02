import { useState, useMemo } from "react";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, FileText, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import * as XLSX from "xlsx";

interface RekapItem {
  id: string;
  studentName: string;
  className: string;
  classGrade: number;
  juz: string;
  nilaiAkhir: number;
  predikat: string;
  tanggal: string;
  nomorSertifikat: string;
  status: string;
}

const generateNomorSertifikat = (tanggal: string, index: number): string => {
  const date = new Date(tanggal);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `SDIT-TH/${year}${month}/${String(index + 1).padStart(4, "0")}`;
};

const RekapSertifikat = () => {
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [filterJuz, setFilterJuz] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["rekap-sertifikat"],
    queryFn: async () => {
      const { data: ujianData, error: ujianError } = await supabase
        .from("ujian")
        .select("*")
        .eq("mode", "Tahfizh")
        .eq("status", "Lulus")
        .order("tanggal", { ascending: false });

      if (ujianError) throw ujianError;

      const studentIds = [...new Set((ujianData || []).map((u) => u.student_id))];
      if (studentIds.length === 0) return { items: [] as RekapItem[], classes: [] as string[] };

      const { data: students } = await supabase
        .from("students")
        .select("id, name, class_id")
        .in("id", studentIds);

      const classIds = [...new Set((students || []).map((s) => s.class_id))];
      const { data: classes } = await supabase
        .from("classes")
        .select("id, name, grade")
        .in("id", classIds);

      const studentMap = new Map((students || []).map((s) => [s.id, s]));
      const classMap = new Map((classes || []).map((c) => [c.id, c]));

      const items: RekapItem[] = (ujianData || []).map((u, i) => {
        const student = studentMap.get(u.student_id);
        const cls = student ? classMap.get(student.class_id) : null;
        const aspek = u.nilai_aspek as any;
        const entries = aspek?.surahEntries || [];
        const juzList = [...new Set(entries.map((e: any) => e.juz))].sort((a: number, b: number) => a - b);

        return {
          id: u.id,
          studentName: student?.name || "Unknown",
          className: cls?.name || "Unknown",
          classGrade: cls?.grade || 0,
          juz: juzList.length > 0 ? juzList.join(", ") : "-",
          nilaiAkhir: u.nilai_akhir,
          predikat: aspek?.predikat || (u.nilai_akhir >= 90 ? "Mumtaz" : u.nilai_akhir >= 80 ? "Jiddan Jayyid" : u.nilai_akhir >= 70 ? "Jayyid" : "Perlu Perbaikan"),
          tanggal: u.tanggal,
          nomorSertifikat: generateNomorSertifikat(u.tanggal, i),
          status: u.status,
        };
      });

      const uniqueClasses = [...new Set(items.map((i) => i.className))].sort();

      return { items, classes: uniqueClasses };
    },
  });

  const items = data?.items || [];
  const classOptions = data?.classes || [];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filterKelas !== "all" && item.className !== filterKelas) return false;
      if (filterJuz !== "all" && !item.juz.includes(filterJuz)) return false;
      return true;
    });
  }, [items, filterKelas, filterJuz]);

  const chartData = useMemo(() => {
    const classCount: Record<string, number> = {};
    filtered.forEach((item) => {
      classCount[item.className] = (classCount[item.className] || 0) + 1;
    });
    return Object.entries(classCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

  const juzOptions = useMemo(() => {
    const juzSet = new Set<string>();
    items.forEach((item) => {
      item.juz.split(", ").forEach((j) => {
        if (j !== "-") juzSet.add(j);
      });
    });
    return [...juzSet].sort((a, b) => parseInt(a) - parseInt(b));
  }, [items]);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((item, i) => ({
        No: i + 1,
        "Nama Siswa": item.studentName,
        Kelas: item.className,
        "Juz Diujikan": item.juz,
        "Nilai Akhir": item.nilaiAkhir,
        Predikat: item.predikat,
        "Tanggal Lulus": item.tanggal,
        "Nomor Sertifikat": item.nomorSertifikat,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Sertifikat");
    XLSX.writeFile(wb, "rekap_sertifikat_tahfizh.xlsx");
  };

  const CHART_COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(142 76% 36%)",
    "hsl(48 96% 53%)",
    "hsl(0 84% 60%)",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">📁 Rekap Siswa Bersertifikat</h2>
            <p className="text-sm text-muted-foreground">Data siswa yang lulus sertifikasi Tahfizh</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              disabled={filtered.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-success text-success-foreground hover:bg-success/90 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Semua Kelas</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterJuz}
              onChange={(e) => setFilterJuz(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Semua Juz</option>
              {juzOptions.map((j) => (
                <option key={j} value={j}>Juz {j}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6 shadow-card mb-6">
                <h3 className="font-semibold text-foreground mb-4">📊 Jumlah Siswa Lulus per Kelas</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="count" name="Siswa Lulus" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
                <p className="text-2xl font-bold text-primary">{filtered.length}</p>
                <p className="text-xs text-muted-foreground">Total Lulus</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
                <p className="text-2xl font-bold text-success">{filtered.filter((i) => i.predikat === "Mumtaz").length}</p>
                <p className="text-xs text-muted-foreground">Mumtaz</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
                <p className="text-2xl font-bold text-accent">{filtered.filter((i) => i.predikat === "Jiddan Jayyid").length}</p>
                <p className="text-xs text-muted-foreground">Jiddan Jayyid</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
                <p className="text-2xl font-bold text-secondary">{filtered.filter((i) => i.predikat === "Jayyid").length}</p>
                <p className="text-xs text-muted-foreground">Jayyid</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">No</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Siswa</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kelas</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Juz</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Nilai</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Predikat</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tanggal Lulus</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">No. Sertifikat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, i) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{item.studentName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.className}</td>
                        <td className="px-4 py-3 text-muted-foreground">Juz {item.juz}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${item.nilaiAkhir >= 90 ? "text-success" : item.nilaiAkhir >= 80 ? "text-primary" : "text-accent"}`}>
                            {item.nilaiAkhir}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.predikat === "Mumtaz" ? "bg-success/10 text-success" :
                            item.predikat === "Jiddan Jayyid" ? "bg-primary/10 text-primary" :
                            "bg-accent/10 text-accent"
                          }`}>
                            {item.predikat}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.tanggal}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{item.nomorSertifikat}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                          Belum ada siswa yang lulus sertifikasi Tahfizh
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RekapSertifikat;
