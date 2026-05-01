// Generator catatan guru otomatis berdasarkan nilai akhir Tahfizh / Tahsin

export type CatatanMode = 'auto' | 'manual';

export function generateCatatanOtomatis(nilaiAkhir: number, namaSiswa?: string): string {
  const ananda = namaSiswa || 'Ananda';
  if (nilaiAkhir >= 85) {
    return `${ananda} menunjukkan hafalan yang sangat baik dengan kelancaran dan ketepatan tajwid yang terjaga. Pengucapan makhraj sudah jelas dan adab saat membaca juga sangat baik. Diharapkan ${ananda} dapat terus menjaga kualitas ini dan semakin meningkatkan hafalan ke depannya. Barakallah fiik.`;
  }
  if (nilaiAkhir >= 70) {
    return `${ananda} sudah memiliki hafalan yang cukup baik, namun masih perlu meningkatkan kelancaran dan ketepatan tajwid pada beberapa bagian. Pengucapan makhraj perlu lebih diperhatikan agar lebih jelas. Terus semangat berlatih agar bacaan semakin tartil dan baik. Barakallah fiik.`;
  }
  return `${ananda} perlu meningkatkan hafalan dan kelancaran dalam membaca. Beberapa kesalahan pada tajwid dan makhraj masih perlu diperbaiki melalui latihan rutin. Tetap semangat belajar dan terus berlatih, insyaAllah kemampuan akan semakin baik. Barakallah fiik.`;
}

export function getCatatanLevel(nilaiAkhir: number): 'tinggi' | 'sedang' | 'rendah' {
  if (nilaiAkhir >= 85) return 'tinggi';
  if (nilaiAkhir >= 70) return 'sedang';
  return 'rendah';
}