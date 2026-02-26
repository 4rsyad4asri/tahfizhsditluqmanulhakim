import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ClassCard from "@/components/ClassCard";
import { generateMockData } from "@/data/mockData";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";

const mockData = generateMockData();

const Dashboard = () => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const filteredClasses = useMemo(() => {
    if (selectedGrade === null) return mockData;
    return mockData.filter(c => c.grade === selectedGrade);
  }, [selectedGrade]);

  const totalStudents = mockData.reduce((sum, c) => sum + c.students.length, 0);
  const avgProgress = Math.round(
    mockData.reduce((sum, c) => sum + c.students.reduce((s, st) => s + st.progressHafalan, 0), 0) /
    totalStudents
  );
  const totalLulus = mockData.reduce(
    (sum, c) => sum + c.students.filter(s => s.statusSertifikasi === 'Lulus').length,
    0
  );

  const stats = [
    { icon: Users, label: "Total Siswa", value: totalStudents, color: "text-primary" },
    { icon: BookOpen, label: "Rata-rata Hafalan", value: `${avgProgress}%`, color: "text-secondary" },
    { icon: Award, label: "Lulus Sertifikasi", value: totalLulus, color: "text-accent" },
    { icon: TrendingUp, label: "Total Kelas", value: mockData.length, color: "text-info" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border border-border p-4 shadow-card animate-fade-in">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grade Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedGrade(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedGrade === null
                ? 'gradient-islamic text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Semua Kelas
          </button>
          {[1, 2, 3, 4, 5, 6].map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGrade === grade
                  ? 'gradient-islamic text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Kelas {grade}
            </button>
          ))}
        </div>

        {/* Bismillah */}
        <div className="text-center mb-6">
          <p className="font-arabic text-2xl text-primary opacity-70">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredClasses.map((classInfo) => (
            <ClassCard key={classInfo.name} classInfo={classInfo} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
