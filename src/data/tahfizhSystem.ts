import { getSurahsForJuz } from "@/data/quranData";
import { getStandardExamGrading } from "@/data/grading";

export type TahfizhExamMode = "Sertifikat" | "Reguler";
export type TahfizhDocumentStatus = "Draft" | "Published";
export type TahfizhStatus = "Lulus" | "Tidak Lulus";
export type TahfizhStopReason = "auto_fail" | "manual_stop" | null;

export interface TahfizhSurahAssessment {
  surah: string;
  juz: number;
  ayatAwal?: number | string;
  ayatAkhir?: number | string;
  ayatRange?: string;
  kelancaran: number;
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
  failedAtIndex?: number;
  failedAtSurah?: string;
  failedReason?: string;
  log?: string;
}

export interface TahfizhAutoFailConfig {
  lahnJaliMax: number;
  salahSambungMax: number;
  ignoreMaxErrors?: boolean;
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
};

export const DEFAULT_TAHFIZH_AUTO_FAIL_CONFIG: TahfizhAutoFailConfig = {
  lahnJaliMax: 15,
  salahSambungMax: 15,
  ignoreMaxErrors: false,
};

export const JUZ_30_CERTIFICATE_SEQUENCE: TahfizhSurahAssessment[] = [
  { surah: "An-Naba", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "An-Nazi'at", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "'Abasa", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Takwir", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Infitar - Al-Mutaffifin", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0, sequenceLabel: "Al-Infitar - Al-Mutaffifin" },
  { surah: "Al-Insyiqaq - Al-Buruj", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Tariq - Al-Ghasyiyah", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Fajr - Al-Balad", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Asy-Syams - Asy-Syarh", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "At-Tin - Al-Bayyinah", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Az-Zalzalah - At-Takasur", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-'Asr - Al-Kausar", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
  { surah: "Al-Kafirun - An-Nas", juz: 30, kelancaran: 100, lahnJali: 0, lahnKhofi: 0, waqaf: 0, salahSambung: 0 },
];

type Juz30Group = {
  label: string;
  members: string[];
};

const JUZ_30_GROUPS: Juz30Group[] = [
  { label: "An-Naba", members: ["An-Naba"] },
  { label: "An-Nazi'at", members: ["An-Nazi'at"] },
  { label: "'Abasa", members: ["'Abasa", "Abasa"] },
  { label: "At-Takwir", members: ["At-Takwir"] },
  { label: "Al-Infitar - Al-Mutaffifin", members: ["Al-Infitar", "Al-Mutaffifin"] },
  { label: "Al-Insyiqaq - Al-Buruj", members: ["Al-Insyiqaq", "Al-Inshiqaq", "Al-Buruj"] },
  { label: "At-Tariq - Al-Ghasyiyah", members: ["At-Tariq", "Al-A'la", "Al-Ghasyiyah", "Al-Ghashiyah"] },
  { label: "Al-Fajr - Al-Balad", members: ["Al-Fajr", "Al-Balad"] },
  { label: "Asy-Syams - Asy-Syarh", members: ["Asy-Syams", "Ash-Shams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "Ash-Sharh", "Al-Insyirah"] },
  { label: "At-Tin - Al-Bayyinah", members: ["At-Tin", "Al-Alaq", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah"] },
  { label: "Az-Zalzalah - At-Takasur", members: ["Az-Zalzalah", "Al-Adiyat", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "At-Takatsur", "At-Takathur"] },
  { label: "Al-'Asr - Al-Kausar", members: ["Al-'Asr", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Quraysh", "Al-Ma'un", "Al-Kausar", "Al-Kautsar", "Al-Kawthar"] },
  { label: "Al-Kafirun - An-Nas", members: ["Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"] },
];

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

export function createCertificateAssessment(index = 0): TahfizhSurahAssessment {
  return { ...JUZ_30_CERTIFICATE_SEQUENCE[index] };
}

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
    sequenceLabel: getSurahLabelForCertificate(item.name, item.ayatRange),
  }));
}

function getSurahLabelForCertificate(name: string, ayatRange?: string) {
  return ayatRange ? `${name} (ayat ${ayatRange})` : name;
}

type RawTahfizhAssessment = Record<string, unknown>;

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function normalizeSurahKey(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/\bs\.d\b/g, "-")
    .replace(/\s+-\s+/g, "-")
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function getJuz30GroupLabel(surah: string) {
  const key = normalizeSurahKey(surah);
  const group = JUZ_30_GROUPS.find(
    (item) => normalizeSurahKey(item.label) === key || item.members.some((member) => normalizeSurahKey(member) === key)
  );

  return group?.label;
}

function getJuz30GroupOrder(label: string) {
  const index = JUZ_30_GROUPS.findIndex((item) => item.label === label);
  return index === -1 ? JUZ_30_GROUPS.length : index;
}

export function normalizeTahfizhAssessment(entry: unknown): TahfizhSurahAssessment {
  const raw = (entry || {}) as RawTahfizhAssessment;
  const juz = Number(raw.juz || 30);
  const rawSurah = String(raw.surah || raw.namaSurat || "");
  const groupedJuz30Label = juz === 30 ? getJuz30GroupLabel(rawSurah) : undefined;

  return {
    surah: groupedJuz30Label || rawSurah.replace(/\s+s\.d\s+/gi, " - "),
    juz,
    ayatAwal: (raw.ayatAwal ?? raw.ayat_awal ?? raw.ayat_mulai) as number | string | undefined,
    ayatAkhir: (raw.ayatAkhir ?? raw.ayat_akhir) as number | string | undefined,
    ayatRange: readOptionalString(raw.ayatRange ?? raw.ayat_range),
    kelancaran: Number(raw.kelancaran ?? 90),
    lahnJali: Number(raw.lahnJali ?? raw.lahn_jali ?? 0),
    lahnKhofi: Number(raw.lahnKhofi ?? raw.lahn_khofi ?? 0),
    waqaf: Number(raw.waqaf ?? raw.waqaf_ibtida ?? 0),
    salahSambung: Number(raw.salahSambung ?? raw.salah_sambung_ayat ?? 0),
    catatan: readString(raw.catatan),
    sequenceLabel: readOptionalString(raw.sequenceLabel),
  };
}

export function aggregateTahfizhAssessmentsForDisplay(
  assessments: unknown[]
): TahfizhSurahAssessment[] {
  const normalized = assessments.map(normalizeTahfizhAssessment);
  const grouped = new Map<string, { base: TahfizhSurahAssessment; kelancaranTotal: number; count: number; order: number }>();
  const passthrough: TahfizhSurahAssessment[] = [];

  normalized.forEach((assessment, index) => {
    if (Number(assessment.juz || 30) !== 30) {
      passthrough.push(assessment);
      return;
    }

    const label = getJuz30GroupLabel(assessment.surah);
    if (!label) {
      passthrough.push(assessment);
      return;
    }

    const existing = grouped.get(label);
    if (!existing) {
      grouped.set(label, {
        base: {
          ...assessment,
          surah: label,
          sequenceLabel: label,
          lahnJali: Number(assessment.lahnJali || 0),
          lahnKhofi: Number(assessment.lahnKhofi || 0),
          waqaf: Number(assessment.waqaf || 0),
          salahSambung: Number(assessment.salahSambung || 0),
          catatan: assessment.catatan || "",
        },
        kelancaranTotal: Number(assessment.kelancaran || 0),
        count: 1,
        order: getJuz30GroupOrder(label),
      });
      return;
    }

    existing.base.lahnJali += Number(assessment.lahnJali || 0);
    existing.base.lahnKhofi += Number(assessment.lahnKhofi || 0);
    existing.base.waqaf += Number(assessment.waqaf || 0);
    existing.base.salahSambung += Number(assessment.salahSambung || 0);
    existing.kelancaranTotal += Number(assessment.kelancaran || 0);
    existing.count += 1;
    existing.base.kelancaran = Math.round(existing.kelancaranTotal / existing.count);

    if (assessment.catatan) {
      existing.base.catatan = [existing.base.catatan, assessment.catatan].filter(Boolean).join("; ");
    }
  });

  return [
    ...passthrough.filter((item) => Number(item.juz || 30) !== 30),
    ...[...grouped.values()]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.base),
    ...passthrough.filter((item) => Number(item.juz || 30) === 30),
  ].sort((a, b) => {
    if (Number(a.juz || 30) !== Number(b.juz || 30)) return Number(b.juz || 30) - Number(a.juz || 30);
    if (Number(a.juz || 30) === 30) return getJuz30GroupOrder(a.surah) - getJuz30GroupOrder(b.surah);
    return 0;
  });
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

export function convertToTahfizhAssessment(entry: unknown): TahfizhSurahAssessment {
  return normalizeTahfizhAssessment(entry);
}

export function calculateTahfizhSurahScore(
  assessment: TahfizhSurahAssessment,
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): number {
  const nilai =
    Number(assessment.kelancaran || 0) -
    Number(assessment.lahnJali || 0) * config.lahnJali -
    Number(assessment.lahnKhofi || 0) * config.lahnKhofi -
    Number(assessment.waqaf || 0) * config.waqaf -
    Number(assessment.salahSambung || 0) * config.salahSambung;

  return Math.round(Math.max(0, Math.min(100, nilai)));
}

export function getTahfizhAutoFailState(
  assessments: TahfizhSurahAssessment[],
  configOrThreshold?: TahfizhAutoFailConfig | number
): TahfizhAutoFailState {
  let totalBlockingErrors = 0;
  let totalLahnJali = 0;
  let totalSalahSambung = 0;
  const legacyCombinedThreshold = typeof configOrThreshold === "number" ? configOrThreshold : configOrThreshold ? undefined : 10;
  const config = typeof configOrThreshold === "object" ? configOrThreshold : undefined;

  if (config?.ignoreMaxErrors) {
    assessments.forEach((item) => {
      totalLahnJali += Number(item.lahnJali || 0);
      totalSalahSambung += Number(item.salahSambung || 0);
    });

    return {
      isFailed: false,
      totalBlockingErrors: totalLahnJali + totalSalahSambung,
      totalLahnJali,
      totalSalahSambung,
    };
  }

  for (let index = 0; index < assessments.length; index += 1) {
    const item = assessments[index];
    totalLahnJali += Number(item.lahnJali || 0);
    totalSalahSambung += Number(item.salahSambung || 0);
    totalBlockingErrors = totalLahnJali + totalSalahSambung;

    if (config) {
      if (totalLahnJali >= config.lahnJaliMax) {
        return {
          isFailed: true,
          totalBlockingErrors,
          totalLahnJali,
          totalSalahSambung,
          failedAtIndex: index,
          failedAtSurah: item.surah,
          failedReason: "Lahn Jali",
          log: `Batas Lahn Jali ${config.lahnJaliMax} tercapai pada soal ke-${index + 1}: ${item.surah}.`,
        };
      }

      if (totalSalahSambung >= config.salahSambungMax) {
        return {
          isFailed: true,
          totalBlockingErrors,
          totalLahnJali,
          totalSalahSambung,
          failedAtIndex: index,
          failedAtSurah: item.surah,
          failedReason: "Salah Sambung",
          log: `Batas Salah Sambung ${config.salahSambungMax} tercapai pada soal ke-${index + 1}: ${item.surah}.`,
        };
      }

      continue;
    }

    if (legacyCombinedThreshold && totalBlockingErrors >= legacyCombinedThreshold) {
      return {
        isFailed: true,
        totalBlockingErrors,
        totalLahnJali,
        totalSalahSambung,
        failedAtIndex: index,
        failedAtSurah: item.surah,
        failedReason: "Lahn Jali + Salah Sambung",
        log: `Kesalahan ke-${legacyCombinedThreshold} tercapai pada soal ke-${index + 1}: ${item.surah}.`,
      };
    }
  }

  return {
    isFailed: false,
    totalBlockingErrors,
    totalLahnJali,
    totalSalahSambung,
  };
}

export function calculateTahfizhSummary(
  assessments: TahfizhSurahAssessment[],
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY
): TahfizhJuzSummary[] {
  const grouped = new Map<number, TahfizhSurahAssessment[]>();

  aggregateTahfizhAssessmentsForDisplay(assessments).forEach((assessment) => {
    const juz = Number(assessment.juz || 30);
    grouped.set(juz, [...(grouped.get(juz) || []), assessment]);
  });

  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([juz, items]) => {
      const totalLahnJali = items.reduce((sum, item) => sum + Number(item.lahnJali || 0), 0);
      const totalLahnKhofi = items.reduce((sum, item) => sum + Number(item.lahnKhofi || 0), 0);
      const totalWaqaf = items.reduce((sum, item) => sum + Number(item.waqaf || 0), 0);
      const totalSalahSambung = items.reduce((sum, item) => sum + Number(item.salahSambung || 0), 0);
      const rataKelancaran = Math.round(
        items.reduce((sum, item) => sum + Number(item.kelancaran || 0), 0) / items.length
      );
      const nilaiJuz = Math.round(
        items.reduce((sum, item) => sum + calculateTahfizhSurahScore(item, config), 0) / items.length
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
  const groupedAssessments = aggregateTahfizhAssessmentsForDisplay(assessments);
  const summaries = calculateTahfizhSummary(groupedAssessments, config);

  return summaries.map((summary) => {
    const surahs = groupedAssessments.filter((item) => Number(item.juz || 30) === summary.juz);
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
      predikat: "Rosib",
      grade: "D",
      status: "Tidak Lulus",
      statusLabel: "Ujian Tahfizh Diulangi / Gagal",
    };
  }

  const grading = getStandardExamGrading(nilai);
  return { ...grading, statusLabel: grading.status };
}

export function calculateTahfizhExamResult(
  assessments: TahfizhSurahAssessment[],
  mode: TahfizhExamMode = "Reguler",
  config: TahfizhPenaltyConfig = DEFAULT_TAHFIZH_PENALTY,
  manualStopReason = "",
  ignoreAutoFail = false,
  autoFailConfig?: TahfizhAutoFailConfig
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
      autoFail: { isFailed: false, totalBlockingErrors: 0 },
    };
  }

  const normalized = aggregateTahfizhAssessmentsForDisplay(assessments);
  const nilaiPerJuz = calculateJuzResults(normalized, config);
  const summaries = calculateTahfizhSummary(normalized, config);
  const rataRataAkhir = Math.round(
    summaries.reduce((sum, summary) => sum + summary.nilaiJuz, 0) / summaries.length
  );
  const autoFail =
    mode === "Sertifikat" && !ignoreAutoFail
      ? getTahfizhAutoFailState(normalized, autoFailConfig)
      : { ...getTahfizhAutoFailState(normalized, autoFailConfig), isFailed: false };
  const finalState = getPredikatAndGrade(rataRataAkhir, autoFail, manualStopReason);

  return {
    mode,
    nilaiPerJuz,
    summaries,
    nilaiAkhir: finalState.statusLabel === "Ujian Tahfizh Diulangi / Gagal" ? 0 : rataRataAkhir,
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
