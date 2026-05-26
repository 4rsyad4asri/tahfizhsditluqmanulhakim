import { getSurahsForJuz } from "@/data/quranData";

export type TahfizhExamMode = "Sertifikat" | "Reguler";
export type TahfizhDocumentStatus = "Draft" | "Published";
export type TahfizhStatus = "Lulus" | "Tidak Lulus" | "Ulang";
export type TahfizhStopReason = "auto_fail" | "manual_stop" | null;

export interface TahfizhSurahAssessment {
  surah: string;
  juz: number;
  ayatAwal?: number | string;
  ayatAkhir?: number | string;
  ayatRange?: string;
  kelancaran: number;
  kelancaranManual?: boolean;
  lahnJali: number;
  lahnKhofi: number;
  waqaf: number;
  salahSambung: number;
  catatan?: string;
  sequenceLabel?: string;
}

export interface TahfizhPenaltyConfig {
  lahnJali: number;
  lahnKhofi: number;
  waqaf: number;
  salahSambung: number;
  maxLahnJali?: number;
  maxSalahSambung?: number;
}

export interface TahfizhJuzSummary {
  juz: number;
  totalLahnJali: number;
  totalLahnKhofi: number;
  totalWaqaf: number;
  totalSalahSambung: number;
  rataKelancaran: number;
  nilaiJuz: number;
  jumlahSoal: number;
}

export interface TahfizhJuzResult extends TahfizhJuzSummary {
  surahs: TahfizhSurahAssessment[];
  nilaiPerSurah: number[];
  rataRataJuz: number;
}

export interface TahfizhAutoFailState {
  isFailed: boolean;
  totalBlockingErrors: number;
  totalLahnJali?: number;
  totalSalahSambung?: number;
  maxLahnJali?: number;
  maxSalahSambung?: number;
  failedAtIndex?: number;
  failedAtSurah?: string;
  log?: string;
}

export interface TahfizhExamResult {
  mode: TahfizhExamMode;
  nilaiPerJuz: TahfizhJuzResult[];
  summaries: TahfizhJuzSummary[];
  nilaiAkhir: number;
  rataRataAkhir: number;
  predikat: string;
  status: TahfizhStatus;
  grade: string;
  statusLabel: string;
  autoFail: TahfizhAutoFailState;
}

export const DEFAULT_TAHFIZH_PENALTY: TahfizhPenaltyConfig = {
  lahnJali: 2,
  lahnKhofi: 1,
  waqaf: 1,
  salahSambung: 2,
  maxLahnJali: 10,
  maxSalahSambung: 10,
};

export const JUZ_30_CERTIFICATE_SEQUENCE: TahfizhSurahAssessment[] = [
  { surah: "An-Naba", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "An-Nazi'at", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "'Abasa", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Takwir", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Infitar s.d Al-Mutaffifin", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0, sequenceLabel: "Al-Infitar s.d Al-Mutaffifin" },
  { surah: "Al-Insyiqaq s.d Al-Buruj", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Tariq s.d Al-Ghasyiyah", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Fajr s.d Al-Balad", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Asy-Syams s.d Asy-Syarh", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Tin s.d Al-Bayyinah", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Az-Zalzalah s.d At-Takasur", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-'Asr s.d Al-Kausar", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Kafirun s.d Al-Ikhlas", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
];

export function getCertificateSequenceForJuz(juz = 30): TahfizhSurahAssessment[] {
  if (juz === 30) {
    return JUZ_30_CERTIFICATE_SEQUENCE.map((item) => ({ ...item }));
  }

  return getSurahsForJuz(juz).map((item) => ({
    surah: item.name,
    juz,
    ayatRange: item.ayatRange,
    kelancaran: 100,
    lahnJali: 0,
    lahnKhofi: 0,
    waqaf: 0,
    salahSambung: 0,
    catatan: "",
  }));
}

export function createEmptyTahfizhAssessment(juz = 30): TahfizhSurahAssessment {
  const firstSurah = getSurahsForJuz(juz)[0];

  return {
    surah: firstSurah?.name || "An-Naba",
    juz,
    ayatRange: firstSurah?.ayatRange,
    kelancaran: 100,
    lahnJali: 0,
    lahnKhofi: 0,
    waqaf: 0,
    salahSambung: 0,
    catatan: "",
  };
}

export function createCertificateAssessment(index = 0, juz = 30): TahfizhSurahAssessment {
  return { ...getCertificateSequenceForJuz(juz)[index] };
}

function numberOrZero(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clampScore(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)));
}

export function calculateAutoTahfizhKelancaran(
  assessment: TahfizhSurahAssessment,
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): number {
  const lahnJali = numberOrZero(assessment.lahnJali);
  const salahSambung = numberOrZero(assessment.salahSambung);

  const nilai =
    100 -
    lahnJali * numberOrZero(config.lahnJali) -
    salahSambung * numberOrZero(config.salahSambung);

  return clampScore(nilai);
}

export function normalizeTahfizhAssessment(entry: any): TahfizhSurahAssessment {
  return {
    surah: String(entry?.surah || entry?.namaSurat || ""),
    juz: Number(entry?.juz || 30),
    ayatAwal: entry?.ayatAwal ?? entry?.ayat_awal ?? entry?.ayat_mulai,
    ayatAkhir: entry?.ayatAkhir ?? entry?.ayat_akhir,
    ayatRange: entry?.ayatRange ?? entry?.ayat_range,
    kelancaran: Number(entry?.kelancaran ?? 100),
    kelancaranManual: Boolean(entry?.kelancaranManual ?? entry?.kelancaran_manual ?? false),
    lahnJali: Number(entry?.lahnJali ?? entry?.lahn_jali ?? 0),
    lahnKhofi: Number(entry?.lahnKhofi ?? entry?.lahn_khofi ?? 0),
    waqaf: Number(entry?.waqaf ?? entry?.waqaf_ibtida ?? 0),
    salahSambung: Number(entry?.salahSambung ?? entry?.salah_sambung_ayat ?? 0),
    catatan: entry?.catatan ?? "",
    sequenceLabel: entry?.sequenceLabel,
  };
}

export function toLegacyTahfizhEntry(entry: TahfizhSurahAssessment) {
  return {
    surah: entry.surah,
    juz: entry.juz,
    lahn_jali: entry.lahnJali,
    lahn_khofi: entry.lahnKhofi,
    kelancaran: entry.kelancaran,
    waqaf_ibtida: entry.waqaf,
    salah_sambung_ayat: entry.salahSambung,
    ayat_awal: entry.ayatAwal,
    ayat_akhir: entry.ayatAkhir,
    ayat_range: entry.ayatRange,
    catatan: entry.catatan,
  };
}

export function convertToTahfizhAssessment(entry: any): TahfizhSurahAssessment {
  return normalizeTahfizhAssessment(entry);
}

export function calculateTahfizhSurahScore(
  assessment: TahfizhSurahAssessment,
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): number {
  const nilai =
    numberOrZero(assessment.kelancaran) -
    numberOrZero(assessment.lahnJali) * numberOrZero(config.lahnJali) -
    numberOrZero(assessment.lahnKhofi) * numberOrZero(config.lahnKhofi) -
    numberOrZero(assessment.waqaf) * numberOrZero(config.waqaf) -
    numberOrZero(assessment.salahSambung) * numberOrZero(config.salahSambung);

  return clampScore(nilai);
}

export function getTahfizhAutoFailState(
  assessments: TahfizhSurahAssessment[],
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): TahfizhAutoFailState {
  const maxLahnJali = Math.max(1, numberOrZero(config.maxLahnJali ?? 10));
  const maxSalahSambung = Math.max(1, numberOrZero(config.maxSalahSambung ?? 10));

  const grouped = new Map<number, TahfizhSurahAssessment[]>();

  assessments.forEach((assessment) => {
    const juz = Number(assessment.juz || 30);
    grouped.set(juz, [...(grouped.get(juz) || []), assessment]);
  });

  let totalBlockingErrors = 0;
  let totalLahnJali = 0;
  let totalSalahSambung = 0;
  let failedAtIndex: number | undefined;
  let failedAtSurah: string | undefined;
  const logs: string[] = [];

  [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .forEach(([juz, items]) => {
      const juzLahnJali = items.reduce((sum, item) => sum + numberOrZero(item.lahnJali), 0);
      const juzSalahSambung = items.reduce((sum, item) => sum + numberOrZero(item.salahSambung), 0);

      totalLahnJali += juzLahnJali;
      totalSalahSambung += juzSalahSambung;
      totalBlockingErrors += juzLahnJali + juzSalahSambung;

      const isLahnJaliFailed = juzLahnJali >= maxLahnJali;
      const isSalahSambungFailed = juzSalahSambung >= maxSalahSambung;

      if (isLahnJaliFailed) {
        logs.push(`Juz ${juz}: total Lahn Jali ${juzLahnJali} mencapai batas maksimal ${maxLahnJali}.`);
      }

      if (isSalahSambungFailed) {
        logs.push(`Juz ${juz}: total Salah Sambung Ayat ${juzSalahSambung} mencapai batas maksimal ${maxSalahSambung}.`);
      }

      if ((isLahnJaliFailed || isSalahSambungFailed) && failedAtIndex === undefined) {
        const failedItem = items.find(
          (item) =>
            numberOrZero(item.lahnJali) > 0 ||
            numberOrZero(item.salahSambung) > 0
        );

        const globalIndex = failedItem
          ? assessments.findIndex((assessment) => assessment === failedItem)
          : undefined;

        failedAtIndex = globalIndex === -1 ? undefined : globalIndex;
        failedAtSurah = failedItem?.surah;
      }
    });

  return {
    isFailed: logs.length > 0,
    totalBlockingErrors,
    totalLahnJali,
    totalSalahSambung,
    maxLahnJali,
    maxSalahSambung,
    failedAtIndex,
    failedAtSurah,
    log: logs.join(" "),
  };
}

export function calculateTahfizhSummary(
  assessments: TahfizhSurahAssessment[],
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): TahfizhJuzSummary[] {
  const grouped = new Map<number, TahfizhSurahAssessment[]>();

  assessments.forEach((assessment) => {
    const juz = Number(assessment.juz || 30);
    grouped.set(juz, [...(grouped.get(juz) || []), assessment]);
  });

  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([juz, items]) => {
      const totalLahnJali = items.reduce((sum, item) => sum + numberOrZero(item.lahnJali), 0);
      const totalLahnKhofi = items.reduce((sum, item) => sum + numberOrZero(item.lahnKhofi), 0);
      const totalWaqaf = items.reduce((sum, item) => sum + numberOrZero(item.waqaf), 0);
      const totalSalahSambung = items.reduce((sum, item) => sum + numberOrZero(item.salahSambung), 0);

      const rataKelancaran = Math.round(
        items.reduce((sum, item) => sum + numberOrZero(item.kelancaran), 0) / items.length
      );

      const nilaiPerSoal = items.map((item) =>
        calculateTahfizhSurahScore(item, config)
      );

      const nilaiJuz = Math.round(
        nilaiPerSoal.reduce((sum, nilai) => sum + nilai, 0) / nilaiPerSoal.length
      );

      return {
        juz,
        totalLahnJali,
        totalLahnKhofi,
        totalWaqaf,
        totalSalahSambung,
        rataKelancaran,
        nilaiJuz,
        jumlahSoal: items.length,
      };
    });
}

function calculateJuzResults(
  assessments: TahfizhSurahAssessment[],
  config: TahfizhPenaltyConfig
): TahfizhJuzResult[] {
  const summaries = calculateTahfizhSummary(assessments, config);

  return summaries.map((summary) => {
    const surahs = assessments.filter((item) => Number(item.juz || 30) === summary.juz);
    const nilaiPerSurah = surahs.map((surah) => calculateTahfizhSurahScore(surah, config));

    return {
      ...summary,
      surahs,
      nilaiPerSurah,
      rataRataJuz: summary.nilaiJuz,
    };
  });
}

function getPredikatAndGrade(
  nilai: number,
  autoFail: TahfizhAutoFailState,
  manualStopReason?: string
): { predikat: string; grade: string; status: TahfizhStatus; statusLabel: string } {
  if (autoFail.isFailed || manualStopReason?.trim()) {
    return {
      predikat: "Wajib Mengulang",
      grade: "D",
      status: "Ulang",
      statusLabel: "Ujian Tahfizh Diulang",
    };
  }

  if (nilai >= 90) {
    return {
      predikat: "Mumtaz",
      grade: "A+",
      status: "Lulus",
      statusLabel: "Lulus",
    };
  }

  if (nilai >= 85) {
    return {
      predikat: "Jayyid Jiddan",
      grade: "A",
      status: "Lulus",
      statusLabel: "Lulus",
    };
  }

  if (nilai >= 76) {
    return {
      predikat: "Jayyid",
      grade: "B",
      status: "Lulus",
      statusLabel: "Lulus",
    };
  }

  if (nilai >= 70) {
    return {
      predikat: "Maqbul",
      grade: "C",
      status: "Lulus",
      statusLabel: "Lulus",
    };
  }

  return {
    predikat: "Rosib",
    grade: "D",
    status: "Tidak Lulus",
    statusLabel: "Tidak Lulus",
  };
}

export function calculateTahfizhExamResult(
  assessments: TahfizhSurahAssessment[],
  mode: TahfizhExamMode = "Reguler",
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY,
  manualStopReason = ""
): TahfizhExamResult {
  if (!assessments.length) {
    return {
      mode,
      nilaiPerJuz: [],
      summaries: [],
      nilaiAkhir: 0,
      rataRataAkhir: 0,
      predikat: "Rosib",
      status: "Tidak Lulus",
      grade: "D",
      statusLabel: "Tidak Lulus",
      autoFail: {
        isFailed: false,
        totalBlockingErrors: 0,
        totalLahnJali: 0,
        totalSalahSambung: 0,
        maxLahnJali: numberOrZero(config.maxLahnJali ?? 10),
        maxSalahSambung: numberOrZero(config.maxSalahSambung ?? 10),
      },
    };
  }

  const normalized = assessments.map(normalizeTahfizhAssessment);
  const nilaiPerJuz = calculateJuzResults(normalized, config);
  const summaries = calculateTahfizhSummary(normalized, config);

  const rataRataAkhir = Math.round(
    summaries.reduce((sum, summary) => sum + summary.nilaiJuz, 0) / summaries.length
  );

  const autoFail = getTahfizhAutoFailState(normalized, config);
  const finalState = getPredikatAndGrade(rataRataAkhir, autoFail, manualStopReason);

  return {
    mode,
    nilaiPerJuz,
    summaries,
    nilaiAkhir: rataRataAkhir,
    rataRataAkhir,
    ...finalState,
    autoFail,
  };
}

export function validateTahfizhAssessment(
  assessment: TahfizhSurahAssessment
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!assessment.surah?.trim()) errors.push("Nama surat wajib diisi");
  if (!Number.isFinite(Number(assessment.juz)) || Number(assessment.juz) < 1 || Number(assessment.juz) > 30) {
    errors.push("Juz harus antara 1-30");
  }
  if (Number(assessment.kelancaran) < 0 || Number(assessment.kelancaran) > 100) {
    errors.push("Kelancaran harus antara 0-100");
  }
  if (Number(assessment.lahnJali) < 0) errors.push("Lahn Jali tidak boleh negatif");
  if (Number(assessment.lahnKhofi) < 0) errors.push("Lahn Khofi tidak boleh negatif");
  if (Number(assessment.waqaf) < 0) errors.push("Waqaf tidak boleh negatif");
  if (Number(assessment.salahSambung) < 0) errors.push("Salah Sambung tidak boleh negatif");

  return {
    valid: errors.length === 0,
    errors,
  };
}
