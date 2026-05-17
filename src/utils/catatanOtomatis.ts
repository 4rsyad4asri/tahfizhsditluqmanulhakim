export type RaportMode =
  | "Tahfizh"
  | "Tahsin Dasar"
  | "Tahsin Lanjutan";

type BaseParams = {
  nilaiAkhir: number;
  namaSiswa?: string;
  kelancaran?: number;
};

type TahfizhParams = BaseParams & {
  mode: "Tahfizh";
  lahnJali?: number;
  lahnKhofi?: number;
  waqaf?: number;
  salahSambungAyat?: number;
};

type TahsinDasarParams = BaseParams & {
  mode: "Tahsin Dasar";
  harakat?: number;
  tajwid?: number;
  mad?: number;
  qalqalah?: number;
};

type TahsinLanjutanParams = BaseParams & {
  mode: "Tahsin Lanjutan";
  lahnJali?: number;
  lahnKhofi?: number;
  waqaf?: number;
};

type GenerateCatatanParams =
  | TahfizhParams
  | TahsinDasarParams
  | TahsinLanjutanParams;

export default function generateCatatanOtomatis(
  params: GenerateCatatanParams
): string {
  const nilai = Number(params.nilaiAkhir) || 0;
  const ananda = params.namaSiswa || "Ananda";
  const kelancaran = params.kelancaran ?? 90;

  let pembuka = "";
  const catatan: string[] = [];

  if (nilai >= 90) {
    pembuka = `${ananda} menunjukkan hasil yang sangat baik dalam pembelajaran Al-Qur'an.`;
  } else if (nilai >= 80) {
    pembuka = `${ananda} memiliki kemampuan membaca Al-Qur'an yang baik dan terus berkembang.`;
  } else if (nilai >= 70) {
    pembuka = `${ananda} telah berusaha dengan baik dalam pembelajaran Al-Qur'an.`;
  } else {
    pembuka = `${ananda} masih memerlukan latihan dan pendampingan yang lebih rutin dalam membaca Al-Qur'an.`;
  }

  // ========================================
  // TAHSIN DASAR
  // ========================================

  if (params.mode === "Tahsin Dasar") {
    const harakat = params.harakat ?? 0;
    const tajwid = params.tajwid ?? 0;
    const mad = params.mad ?? 0;
    const qalqalah = params.qalqalah ?? 0;

    const evaluasi: {
      aspek: string;
      skor: number;
      pesan: string;
    }[] = [];

    if (harakat >= 2) {
      evaluasi.push({
        aspek: "harakat",
        skor: harakat,
        pesan:
          harakat >= 5
            ? "ketelitian dalam penerapan harakat masih perlu ditingkatkan"
            : "masih terdapat beberapa kekeliruan kecil dalam penerapan harakat",
      });
    }

    if (tajwid >= 2) {
      evaluasi.push({
        aspek: "tajwid",
        skor: tajwid,
        pesan:
          tajwid >= 6
            ? "pemahaman tajwid dasar dan penerapan hukum bacaan masih perlu diperbaiki"
            : "ketelitian dalam penerapan tajwid dasar masih perlu ditingkatkan",
      });
    }

    if (mad >= 2) {
      evaluasi.push({
        aspek: "mad",
        skor: mad,
        pesan: "ketepatan panjang pendek bacaan (mad) masih perlu diperhatikan",
      });
    }

    if (qalqalah >= 2) {
      evaluasi.push({
        aspek: "qalqalah",
        skor: qalqalah,
        pesan: "ketepatan bacaan qalqalah pada beberapa huruf masih perlu diperbaiki",
      });
    }

    if (kelancaran <= 85) {
      evaluasi.push({
        aspek: "kelancaran",
        skor: 100 - kelancaran,
        pesan:
          kelancaran <= 75
            ? "kelancaran membaca masih perlu banyak latihan dan pembiasaan membaca tartil"
            : "kelancaran membaca sudah cukup baik namun masih perlu ditingkatkan",
      });
    }

    evaluasi.sort((a, b) => b.skor - a.skor);
    const utama = evaluasi.slice(0, 3);

    if (utama.length > 0) {
      catatan.push(utama.map((e) => e.pesan).join(", "));
    }

    if (nilai >= 90 && utama.length === 0) {
      catatan.push(
        "Kemampuan membaca dasar Al-Qur'an sudah sangat baik dan sesuai kaidah pembelajaran"
      );
    }

    catatan.push(
      "Semoga terus semangat dalam belajar dan memperbaiki kualitas bacaan Al-Qur'an"
    );
  }

  // ========================================
  // TAHSIN LANJUTAN
  // ========================================

  if (params.mode === "Tahsin Lanjutan") {
    const lahnJali = params.lahnJali ?? 0;
    const lahnKhofi = params.lahnKhofi ?? 0;
    const waqaf = params.waqaf ?? 0;

    const evaluasi: {
      aspek: string;
      skor: number;
      pesan: string;
    }[] = [];

    if (lahnJali >= 2) {
      evaluasi.push({
        aspek: "makhraj",
        skor: lahnJali,
        pesan:
          lahnJali >= 5
            ? "ketepatan makhraj dan pengucapan huruf masih perlu diperbaiki"
            : "masih terdapat beberapa kesalahan kecil pada pengucapan huruf tertentu",
      });
    }

    if (lahnKhofi >= 4) {
      evaluasi.push({
        aspek: "tajwid",
        skor: lahnKhofi,
        pesan:
          lahnKhofi >= 8
            ? "penerapan hukum tajwid terutama mad dan sifat huruf masih perlu ditingkatkan"
            : "ketelitian dalam penerapan hukum tajwid masih perlu ditingkatkan",
      });
    }

    if (waqaf >= 3) {
      evaluasi.push({
        aspek: "waqaf",
        skor: waqaf,
        pesan: "pemahaman waqaf dan ibtida' masih perlu diperhatikan",
      });
    }

    if (kelancaran <= 85) {
      evaluasi.push({
        aspek: "kelancaran",
        skor: 100 - kelancaran,
        pesan:
          kelancaran <= 75
            ? "kelancaran membaca masih perlu banyak latihan dan pembiasaan membaca tartil"
            : "kelancaran membaca sudah cukup baik namun masih perlu ditingkatkan",
      });
    }

    evaluasi.sort((a, b) => b.skor - a.skor);
    const utama = evaluasi.slice(0, 3);

    if (utama.length > 0) {
      catatan.push(utama.map((e) => e.pesan).join(", "));
    }

    if (nilai >= 90 && utama.length === 0) {
      catatan.push(
        "Kemampuan membaca Al-Qur'an dengan penerapan tajwid dan waqaf sudah sangat baik"
      );
    }

    catatan.push(
      "Diharapkan terus meningkatkan kualitas bacaan agar semakin tartil dan sesuai kaidah tajwid"
    );
  }

  // ========================================
  // TAHFIZH
  // ========================================

  if (params.mode === "Tahfizh") {
    const lahnJali = params.lahnJali ?? 0;
    const lahnKhofi = params.lahnKhofi ?? 0;
    const waqaf = params.waqaf ?? 0;
    const salahSambungAyat = params.salahSambungAyat ?? 0;

    const totalKesalahan =
      lahnJali + lahnKhofi + waqaf + salahSambungAyat;

    if (nilai >= 90 && totalKesalahan <= 2) {
      catatan.push(
        "Hafalan Al-Qur'an sudah sangat baik dengan kelancaran dan ketepatan yang sangat memuaskan"
      );
    } else if (nilai >= 80) {
      catatan.push(
        "Hafalan sudah baik namun masih perlu meningkatkan kelancaran dan muroja'ah secara rutin"
      );
    } else if (nilai >= 70) {
      catatan.push(
        "Perlu meningkatkan kelancaran hafalan dan memperbanyak muroja'ah agar hafalan lebih kuat"
      );
    } else {
      catatan.push(
        "Perlu pendampingan dan latihan muroja'ah yang lebih rutin agar hafalan semakin baik"
      );
    }

    if (salahSambungAyat >= 2) {
      catatan.push(
        "Ketelitian dalam menyambung ayat masih perlu diperhatikan"
      );
    }

    catatan.push(
      "Semoga Allah memudahkan dalam menjaga hafalan Al-Qur'an"
    );
  }

  return `${pembuka} ${catatan.join(". ")}. Barakallahu fiik.`;
}