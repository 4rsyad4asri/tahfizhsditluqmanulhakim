export type ExamStatus = "Lulus" | "Tidak Lulus";

export interface ExamGrading {
  nilaiAkhir: number;
  status: ExamStatus;
  grade: string;
  predikat: string;
}

export function getStandardExamGrading(nilai: number): ExamGrading {
  const nilaiAkhir = Math.round(Number(nilai) || 0);
  const status: ExamStatus = nilaiAkhir >= 70 ? "Lulus" : "Tidak Lulus";

  if (nilaiAkhir >= 96) {
    return { nilaiAkhir, status, grade: "A+", predikat: "Mumtaz Murtafi" };
  }

  if (nilaiAkhir >= 90) {
    return { nilaiAkhir, status, grade: "A", predikat: "Mumtaz" };
  }

  if (nilaiAkhir >= 86) {
    return { nilaiAkhir, status, grade: "B+", predikat: "Jayyid Jiddan" };
  }

  if (nilaiAkhir >= 80) {
    return { nilaiAkhir, status, grade: "B", predikat: "Jayyid" };
  }

  if (nilaiAkhir >= 70) {
    return { nilaiAkhir, status, grade: "C", predikat: "Maqbul" };
  }

  return { nilaiAkhir, status, grade: "D", predikat: "Rosib" };
}

