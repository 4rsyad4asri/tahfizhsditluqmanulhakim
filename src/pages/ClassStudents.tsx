import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { generateMockData } from "@/data/mockData";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const mockData = generateMockData();

const ClassStudents = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const classInfo = useMemo(() => {
    if (!classId) return null;
    const grade = parseInt(classId.charAt(0));
    const section = classId.charAt(1);
    return mockData.find(c => c.grade === grade && c.section === section) || null;
  }, [classId]);

  if (!classInfo) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Kelas tidak ditemukan</div>;
  }

  const filteredStudents = classInfo.students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Lulus':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">✅ Lulus</span>;
      case 'Tidak Lulus':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">❌ Tidak Lulus</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">⏳ Belum Ujian</span>;
    }
  };

  const levelBadge = (level: string) => {
    switch (level) {
      case 'Tahfizh':
        return <Badge className="gradient-islamic text-primary-foreground border-0">{level}</Badge>;
      case 'Tahsin Lanjutan':
        return <Badge className="gradient-gold text-accent-foreground border-0">{level}</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{classInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{classInfo.students.length} siswa terdaftar</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-card rounded-lg border border-border p-4 shadow-card animate-fade-in"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{student.name}</h3>
                {levelBadge(student.level)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Juz</span>
                  <span className="font-medium text-foreground">Juz {student.targetJuz}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-islamic" style={{ width: `${student.progressHafalan}%` }} />
                    </div>
                    <span className="font-medium text-foreground">{student.progressHafalan}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  {statusBadge(student.statusSertifikasi)}
                </div>
              </div>
              <button
                onClick={() => navigate(`/siswa/${student.id}`)}
                className="mt-3 w-full py-2 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-card rounded-lg border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Siswa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Juz</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">Juz {student.targetJuz}</td>
                    <td className="px-4 py-3">{levelBadge(student.level)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full gradient-islamic" style={{ width: `${student.progressHafalan}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{student.progressHafalan}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{statusBadge(student.statusSertifikasi)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/siswa/${student.id}`)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassStudents;
