export interface JuzSurahEntry {
  name: string;
  ayatCount: number;
  ayatRange?: string; // e.g. "1–29" for partial surahs
}

export const JUZ_SURAH_MAP: Record<number, JuzSurahEntry[]> = {
  1: [
    { name: "Al-Fatihah", ayatCount: 7 },
    { name: "Al-Baqarah", ayatCount: 286, ayatRange: "1–141" },
  ],
  2: [
    { name: "Al-Baqarah", ayatCount: 286, ayatRange: "142–252" },
  ],
  3: [
    { name: "Al-Baqarah", ayatCount: 286, ayatRange: "253–286" },
    { name: "Ali 'Imran", ayatCount: 200, ayatRange: "1–92" },
  ],
  4: [
    { name: "Ali 'Imran", ayatCount: 200, ayatRange: "93–200" },
    { name: "An-Nisa", ayatCount: 176, ayatRange: "1–23" },
  ],
  5: [
    { name: "An-Nisa", ayatCount: 176, ayatRange: "24–147" },
  ],
  6: [
    { name: "An-Nisa", ayatCount: 176, ayatRange: "148–176" },
    { name: "Al-Ma'idah", ayatCount: 120, ayatRange: "1–81" },
  ],
  7: [
    { name: "Al-Ma'idah", ayatCount: 120, ayatRange: "82–120" },
    { name: "Al-An'am", ayatCount: 165, ayatRange: "1–110" },
  ],
  8: [
    { name: "Al-An'am", ayatCount: 165, ayatRange: "111–165" },
    { name: "Al-A'raf", ayatCount: 206, ayatRange: "1–87" },
  ],
  9: [
    { name: "Al-A'raf", ayatCount: 206, ayatRange: "88–206" },
    { name: "Al-Anfal", ayatCount: 75, ayatRange: "1–40" },
  ],
  10: [
    { name: "Al-Anfal", ayatCount: 75, ayatRange: "41–75" },
    { name: "At-Tawbah", ayatCount: 129, ayatRange: "1–92" },
  ],
  11: [
    { name: "At-Tawbah", ayatCount: 129, ayatRange: "93–129" },
    { name: "Yunus", ayatCount: 109 },
    { name: "Hud", ayatCount: 123, ayatRange: "1–5" },
  ],
  12: [
    { name: "Hud", ayatCount: 123, ayatRange: "6–123" },
    { name: "Yusuf", ayatCount: 111 },
    { name: "Ar-Ra'd", ayatCount: 43, ayatRange: "1–19" },
  ],
  13: [
    { name: "Ar-Ra'd", ayatCount: 43, ayatRange: "20–43" },
    { name: "Ibrahim", ayatCount: 52 },
    { name: "Al-Hijr", ayatCount: 99 },
  ],
  14: [
    { name: "An-Nahl", ayatCount: 128 },
    { name: "Al-Isra", ayatCount: 111 },
  ],
  15: [
    { name: "Al-Isra", ayatCount: 111 },
    { name: "Al-Kahf", ayatCount: 110 },
  ],
  16: [
    { name: "Maryam", ayatCount: 98 },
    { name: "Ta-Ha", ayatCount: 135 },
  ],
  17: [
    { name: "Al-Anbiya", ayatCount: 112 },
    { name: "Al-Hajj", ayatCount: 78 },
  ],
  18: [
    { name: "Al-Mu'minun", ayatCount: 118 },
    { name: "An-Nur", ayatCount: 64 },
    { name: "Al-Furqan", ayatCount: 77 },
  ],
  19: [
    { name: "Ash-Shu'ara", ayatCount: 227 },
    { name: "An-Naml", ayatCount: 93 },
  ],
  20: [
    { name: "An-Naml", ayatCount: 93 },
    { name: "Al-Qasas", ayatCount: 88 },
    { name: "Al-Ankabut", ayatCount: 69 },
  ],
  21: [
    { name: "Al-Ankabut", ayatCount: 69 },
    { name: "Ar-Rum", ayatCount: 60 },
    { name: "Luqman", ayatCount: 34 },
    { name: "As-Sajdah", ayatCount: 30 },
    { name: "Al-Ahzab", ayatCount: 73 },
  ],
  22: [
    { name: "Al-Ahzab", ayatCount: 73 },
    { name: "Saba", ayatCount: 54 },
    { name: "Fatir", ayatCount: 45 },
    { name: "Ya-Sin", ayatCount: 83 },
  ],
  23: [
    { name: "As-Saffat", ayatCount: 182 },
    { name: "Sad", ayatCount: 88 },
    { name: "Az-Zumar", ayatCount: 75 },
  ],
  24: [
    { name: "Az-Zumar", ayatCount: 75 },
    { name: "Ghafir", ayatCount: 85 },
    { name: "Fussilat", ayatCount: 54 },
  ],
  25: [
    { name: "Fussilat", ayatCount: 54 },
    { name: "Ash-Shura", ayatCount: 53 },
    { name: "Az-Zukhruf", ayatCount: 89 },
    { name: "Ad-Dukhan", ayatCount: 59 },
    { name: "Al-Jathiyah", ayatCount: 37 },
  ],
  26: [
    { name: "Al-Ahqaf", ayatCount: 35 },
    { name: "Muhammad", ayatCount: 38 },
    { name: "Al-Fath", ayatCount: 29 },
    { name: "Al-Hujurat", ayatCount: 18 },
    { name: "Qaf", ayatCount: 45 },
    { name: "Adh-Dhariyat", ayatCount: 60 },
  ],
  27: [
    { name: "Adh-Dhariyat", ayatCount: 60, ayatRange: "31–60" },
    { name: "At-Tur", ayatCount: 49 },
    { name: "An-Najm", ayatCount: 62 },
    { name: "Al-Qamar", ayatCount: 55 },
    { name: "Ar-Rahman", ayatCount: 78 },
    { name: "Al-Waqi'ah", ayatCount: 96 },
    { name: "Al-Hadid", ayatCount: 29 },
  ],
  28: [
    { name: "Al-Mujadilah", ayatCount: 22 },
    { name: "Al-Hashr", ayatCount: 24 },
    { name: "Al-Mumtahanah", ayatCount: 13 },
    { name: "As-Saff", ayatCount: 14 },
    { name: "Al-Jumu'ah", ayatCount: 11 },
    { name: "Al-Munafiqun", ayatCount: 11 },
    { name: "At-Taghabun", ayatCount: 18 },
    { name: "At-Talaq", ayatCount: 12 },
    { name: "At-Tahrim", ayatCount: 12 },
  ],
  29: [
    { name: "Al-Mulk", ayatCount: 30 },
    { name: "Al-Qalam", ayatCount: 52 },
    { name: "Al-Haqqah", ayatCount: 52 },
    { name: "Al-Ma'arij", ayatCount: 44 },
    { name: "Nuh", ayatCount: 28 },
    { name: "Al-Jinn", ayatCount: 28 },
    { name: "Al-Muzzammil", ayatCount: 20 },
    { name: "Al-Muddathir", ayatCount: 56 },
    { name: "Al-Qiyamah", ayatCount: 40 },
    { name: "Al-Insan", ayatCount: 31 },
    { name: "Al-Mursalat", ayatCount: 50 },
  ],
  30: [
    { name: "An-Naba", ayatCount: 40 },
    { name: "An-Nazi'at", ayatCount: 46 },
    { name: "Abasa", ayatCount: 42 },
    { name: "At-Takwir", ayatCount: 29 },
    { name: "Al-Infitar", ayatCount: 19 },
    { name: "Al-Mutaffifin", ayatCount: 36 },
    { name: "Al-Inshiqaq", ayatCount: 25 },
    { name: "Al-Buruj", ayatCount: 22 },
    { name: "At-Tariq", ayatCount: 17 },
    { name: "Al-A'la", ayatCount: 19 },
    { name: "Al-Ghashiyah", ayatCount: 26 },
    { name: "Al-Fajr", ayatCount: 30 },
    { name: "Al-Balad", ayatCount: 20 },
    { name: "Ash-Shams", ayatCount: 15 },
    { name: "Al-Lail", ayatCount: 21 },
    { name: "Ad-Duha", ayatCount: 11 },
    { name: "Ash-Sharh", ayatCount: 8 },
    { name: "At-Tin", ayatCount: 8 },
    { name: "Al-Alaq", ayatCount: 19 },
    { name: "Al-Qadr", ayatCount: 5 },
    { name: "Al-Bayyinah", ayatCount: 8 },
    { name: "Az-Zalzalah", ayatCount: 8 },
    { name: "Al-Adiyat", ayatCount: 11 },
    { name: "Al-Qari'ah", ayatCount: 11 },
    { name: "At-Takathur", ayatCount: 8 },
    { name: "Al-Asr", ayatCount: 3 },
    { name: "Al-Humazah", ayatCount: 9 },
    { name: "Al-Fil", ayatCount: 5 },
    { name: "Quraisy", ayatCount: 4 },
    { name: "Al-Ma'un", ayatCount: 7 },
    { name: "Al-Kawthar", ayatCount: 3 },
    { name: "Al-Kafirun", ayatCount: 6 },
    { name: "An-Nasr", ayatCount: 3 },
    { name: "Al-Masad", ayatCount: 5 },
    { name: "Al-Ikhlas", ayatCount: 4 },
    { name: "Al-Falaq", ayatCount: 5 },
    { name: "An-Nas", ayatCount: 6 },
  ],
};

export function getSurahsForJuz(juz: number): JuzSurahEntry[] {
  return JUZ_SURAH_MAP[juz] || [];
}

export function getSurahLabel(entry: JuzSurahEntry): string {
  if (entry.ayatRange) {
    return `${entry.name} (ayat ${entry.ayatRange})`;
  }
  return `${entry.name} – ${entry.ayatCount} ayat`;
}
