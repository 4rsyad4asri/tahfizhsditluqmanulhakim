export type RaportMode =
  | "Tahfizh"
  | "Tahsin Dasar"
  | "Tahsin Lanjutan";

export function generateCatatanOtomatis(
  mode: RaportMode,
  nilaiAkhir: number,
  namaSiswa?: string
): string {

  const ananda = namaSiswa || "Ananda";

  // =========================
  // TAHSIN DASAR
  // =========================
  if (mode === "Tahsin Dasar") {

    if (nilaiAkhir >= 85) {
      return `${ananda} menunjukkan kemampuan membaca dasar Al-Qur'an yang sangat baik. Pengenalan huruf, harakat, mad, serta tajwid dasar sudah dikuasai dengan baik. Tetap pertahankan semangat belajar dan terus meningkatkan kualitas bacaan. Barakallah fiik.`;
    }

    if (nilaiAkhir >= 70) {
      return `${ananda} sudah memiliki kemampuan membaca dasar yang cukup baik, namun masih perlu meningkatkan ketelitian pada harakat, tajwid, dan kelancaran bacaan. Terus berlatih agar bacaan semakin tartil dan percaya diri. Barakallah fiik.`;
    }

    return `${ananda} masih perlu meningkatkan kemampuan membaca dasar Al-Qur'an terutama dalam pengenalan huruf, harakat, dan kelancaran membaca. Diperlukan latihan rutin dan pendampingan yang lebih intensif agar kemampuan membaca semakin baik. Barakallah fiik.`;
  }

  // =========================
  // TAHSIN LANJUTAN
  // =========================
  if (mode === "Tahsin Lanjutan") {

    if (nilaiAkhir >= 85) {
      return `${ananda} menunjukkan kualitas bacaan Al-Qur'an yang sangat baik dengan penerapan tajwid, makhraj, mad, waqaf, dan kelancaran yang sangat bagus. Diharapkan terus menjaga kualitas bacaan dan menjadi teladan dalam membaca Al-Qur'an. Barakallah fiik.`;
    }

    if (nilaiAkhir >= 70) {
      return `${ananda} sudah memiliki bacaan yang cukup baik, namun masih perlu meningkatkan ketelitian dalam penerapan tajwid, waqaf, serta kelancaran membaca pada beberapa bagian. Terus semangat berlatih agar bacaan semakin sempurna dan tartil. Barakallah fiik.`;
    }

    return `${ananda} masih perlu meningkatkan kualitas bacaan Al-Qur'an terutama dalam aspek tajwid, makhraj, waqaf, dan kelancaran membaca. Diperlukan latihan yang lebih rutin agar kemampuan membaca semakin baik dan benar. Barakallah fiik.`;
  }

  // =========================
  // TAHFIZH
  // =========================
  if (nilaiAkhir >= 85) {
    return `${ananda} menunjukkan hafalan yang sangat baik dengan kelancaran, ketepatan tajwid, dan sambungan ayat yang sangat bagus. Semoga terus istiqamah dalam menjaga hafalan dan semakin menambah hafalan Al-Qur'an. Barakallah fiik.`;
  }

  if (nilaiAkhir >= 70) {
    return `${ananda} sudah memiliki hafalan yang cukup baik, namun masih perlu meningkatkan kelancaran, muroja'ah, dan ketelitian dalam sambungan ayat. Tetap semangat menjaga hafalan agar semakin kuat dan lancar. Barakallah fiik.`;
  }

  return `${ananda} masih perlu meningkatkan kelancaran hafalan dan memperbanyak muroja'ah agar hafalan lebih kuat dan tidak mudah lupa. Tetap semangat berlatih dan terus memperbaiki kualitas hafalan. Barakallah fiik.`;
}
