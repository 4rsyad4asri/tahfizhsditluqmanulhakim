import { aggregateTahfizhAssessmentsForDisplay } from "@/data/tahfizhSystem";

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

function toNumber(value: unknown) {
  return Number(value || 0) || 0;
}

function getRataKelancaran(entries: { kelancaran?: number }[]) {
  if (!entries.length) return 90;
  return Math.round(entries.reduce((sum, entry) => sum + toNumber(entry.kelancaran), 0) / entries.length);
}

type EvaluasiCatatan = {
  aspek: string;
  skor: number;
  pesanRingkas: string;
};

function getPembuka(mode: RaportMode, nilai: number, nama: string) {
  const bidang =
    mode === "Tahsin Dasar"
      ? "pembelajaran Iqra"
      : mode === "Tahsin Lanjutan"
        ? "bacaan Al-Qur'an"
        : "hafalan Al-Qur'an";

  if (nilai >= 90) {
    return `${nama} sudah menunjukkan hasil yang sangat baik dalam ${bidang}.`;
  }

  if (nilai >= 80) {
    return `${nama} sudah berada pada capaian yang baik dalam ${bidang}, dan terlihat ada dasar yang cukup kuat untuk terus ditingkatkan.`;
  }

  if (nilai >= 70) {
    return `${nama} sudah berusaha mengikuti ujian dengan baik, namun masih perlu latihan yang lebih terarah dalam ${bidang}.`;
  }

  return `${nama} masih membutuhkan pendampingan yang lebih rutin dan bertahap dalam ${bidang}.`;
}

function getPenutup(mode: RaportMode, nilai: number) {
  if (mode === "Tahsin Dasar") {
    return nilai >= 85
      ? "Pertahankan latihan Iqra secara rutin agar ketelitian dan kelancaran membaca semakin matang."
      : "Latihan Iqra sebaiknya dilakukan sedikit demi sedikit tetapi konsisten, terutama dengan pendampingan saat membaca.";
  }

  if (mode === "Tahsin Lanjutan") {
    return nilai >= 85
      ? "Teruskan kebiasaan membaca Al-Qur'an dengan tartil agar kualitas bacaan semakin stabil."
      : "Perbanyak membaca Al-Qur'an secara pelan dan tartil agar makhraj, tajwid, dan waqaf semakin rapi.";
  }

  return nilai >= 85
    ? "Jaga hafalan dengan muroja'ah yang teratur agar kelancaran dan ketepatannya tetap kuat."
    : "Muroja'ah perlu dibuat lebih rutin, pendek, dan berulang agar hafalan semakin kuat dan tidak mudah tertukar.";
}

function getKalimatFokus(evaluasi: EvaluasiCatatan[]) {
  const utama = evaluasi
    .filter((item) => item.skor > 0)
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 3);

  if (utama.length === 0) {
    return "Kesalahan yang muncul sangat sedikit, sehingga latihan dapat diarahkan untuk menjaga kestabilan bacaan.";
  }

  if (utama.length === 1) {
    return `Hal yang paling perlu diperhatikan adalah ${utama[0].pesanRingkas}.`;
  }

  const daftar = utama.map((item) => item.pesanRingkas);
  const terakhir = daftar.pop();
  return `Fokus latihan berikutnya adalah ${daftar.join(", ")}, dan ${terakhir}.`;
}

export default function generateCatatanOtomatis(
  params: GenerateCatatanParams
): string {
  const nilai = Number(params.nilaiAkhir) || 0;
  const ananda = params.namaSiswa || "Siswa";
  const kelancaran = params.kelancaran ?? 90;
  const pembuka = getPembuka(params.mode, nilai, ananda);
  const catatan: string[] = [pembuka];

  if (params.mode === "Tahsin Dasar") {
    const harakat = params.harakat ?? 0;
    const tajwid = params.tajwid ?? 0;
    const mad = params.mad ?? 0;
    const qalqalah = params.qalqalah ?? 0;

    const evaluasi: EvaluasiCatatan[] = [];

    if (harakat >= 1) {
      evaluasi.push({
        aspek: "harakat",
        skor: harakat,
        pesanRingkas:
          harakat >= 5
            ? "membiasakan membaca harakat dengan lebih teliti"
            : "merapikan beberapa harakat yang masih tertukar",
      });
    }

    if (tajwid >= 1) {
      evaluasi.push({
        aspek: "tajwid",
        skor: tajwid,
        pesanRingkas:
          tajwid >= 6
            ? "menguatkan kembali tajwid dasar pada bacaan Iqra"
            : "lebih teliti saat menerapkan tajwid dasar",
      });
    }

    if (mad >= 1) {
      evaluasi.push({
        aspek: "mad",
        skor: mad,
        pesanRingkas: "menjaga panjang pendek bacaan agar tidak terburu-buru",
      });
    }

    if (qalqalah >= 1) {
      evaluasi.push({
        aspek: "qalqalah",
        skor: qalqalah,
        pesanRingkas: "melatih pantulan qalqalah supaya terdengar lebih jelas",
      });
    }

    if (kelancaran <= 85) {
      evaluasi.push({
        aspek: "kelancaran",
        skor: 100 - kelancaran,
        pesanRingkas:
          kelancaran <= 75
            ? "membaca Iqra lebih pelan dan tidak terburu-buru"
            : "menjaga kelancaran agar bacaan lebih stabil",
      });
    }

    catatan.push(getKalimatFokus(evaluasi));
  }

  if (params.mode === "Tahsin Lanjutan") {
    const lahnJali = params.lahnJali ?? 0;
    const lahnKhofi = params.lahnKhofi ?? 0;
    const waqaf = params.waqaf ?? 0;

    const evaluasi: EvaluasiCatatan[] = [];

    if (lahnJali >= 1) {
      evaluasi.push({
        aspek: "makhraj",
        skor: lahnJali,
        pesanRingkas:
          lahnJali >= 5
            ? "memperbaiki makhraj dan pengucapan huruf yang masih cukup sering keliru"
            : "lebih teliti pada makhraj beberapa huruf",
      });
    }

    if (lahnKhofi >= 1) {
      evaluasi.push({
        aspek: "tajwid",
        skor: lahnKhofi,
        pesanRingkas:
          lahnKhofi >= 8
            ? "mengulang kembali penerapan tajwid ketika membaca Al-Qur'an"
            : "merapikan tajwid yang masih terlewat saat membaca",
      });
    }

    if (waqaf >= 1) {
      evaluasi.push({
        aspek: "waqaf",
        skor: waqaf,
        pesanRingkas: "memperhatikan tempat berhenti dan memulai bacaan",
      });
    }

    if (kelancaran <= 85) {
      evaluasi.push({
        aspek: "kelancaran",
        skor: 100 - kelancaran,
        pesanRingkas:
          kelancaran <= 75
            ? "membaca lebih tartil agar bacaan tidak terputus-putus"
            : "menjaga tempo bacaan agar lebih tenang dan stabil",
      });
    }

    catatan.push(getKalimatFokus(evaluasi));
  }

  if (params.mode === "Tahfizh") {
    const lahnJali = params.lahnJali ?? 0;
    const lahnKhofi = params.lahnKhofi ?? 0;
    const waqaf = params.waqaf ?? 0;
    const salahSambungAyat = params.salahSambungAyat ?? 0;

    const evaluasi: EvaluasiCatatan[] = [];

    if (lahnJali >= 1) {
      evaluasi.push({
        aspek: "lahn jali",
        skor: lahnJali,
        pesanRingkas:
          lahnJali >= 5
            ? "menguatkan hafalan pada bagian yang masih menyebabkan kesalahan besar"
            : "lebih berhati-hati pada kesalahan besar yang muncul",
      });
    }

    if (lahnKhofi >= 1) {
      evaluasi.push({
        aspek: "lahn khofi",
        skor: lahnKhofi,
        pesanRingkas:
          lahnKhofi >= 6
            ? "merapikan kesalahan kecil yang cukup sering muncul saat setoran hafalan"
            : "merapikan beberapa kesalahan kecil dalam bacaan",
      });
    }

    if (waqaf >= 1) {
      evaluasi.push({
        aspek: "waqaf",
        skor: waqaf,
        pesanRingkas:
          waqaf >= 5
            ? "melatih waqaf dan ibtida' agar hafalan terdengar lebih utuh"
            : "memperhatikan tempat berhenti dan memulai hafalan",
      });
    }

    if (salahSambungAyat >= 1) {
      evaluasi.push({
        aspek: "sambung ayat",
        skor: salahSambungAyat,
        pesanRingkas:
          salahSambungAyat >= 3
            ? "mengulang sambungan antar ayat agar tidak mudah tertukar"
            : "lebih teliti saat menyambung ayat",
      });
    }

    if (kelancaran <= 85) {
      evaluasi.push({
        aspek: "kelancaran",
        skor: 100 - kelancaran,
        pesanRingkas:
          kelancaran <= 75
            ? "menambah muroja'ah agar hafalan lebih lancar"
            : "menjaga kelancaran hafalan agar lebih stabil",
      });
    }

    catatan.push(getKalimatFokus(evaluasi));
  }

  catatan.push(getPenutup(params.mode, nilai));
  return `${catatan.join(" ")} Barakallah fiik.`;
}

export function generateCatatanOtomatisFromUjian(
  ujian: any,
  studentName?: string
) {
  const aspek = ujian?.nilai_aspek || {};
  const mode = ujian?.mode;
  const nilaiAkhir = ujian?.nilai_akhir ?? 0;

  if (mode === "Tahfizh") {
    const entries = Array.isArray(aspek.surahEntries)
      ? aggregateTahfizhAssessmentsForDisplay(aspek.surahEntries)
      : [];

    return generateCatatanOtomatis({
      mode: "Tahfizh",
      nilaiAkhir,
      namaSiswa: studentName,
      lahnJali: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.lahn_jali ?? entry.lahnJali), 0),
      lahnKhofi: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.lahn_khofi ?? entry.lahnKhofi), 0),
      waqaf: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.waqaf_ibtida ?? entry.waqaf), 0),
      salahSambungAyat: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.salah_sambung_ayat ?? entry.salahSambung), 0),
      kelancaran: getRataKelancaran(entries),
    });
  }

  if (mode === "Tahsin Dasar") {
    const entries = Array.isArray(aspek.entries) ? aspek.entries : [];

    return generateCatatanOtomatis({
      mode: "Tahsin Dasar",
      nilaiAkhir,
      namaSiswa: studentName,
      harakat: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.salah_harakat), 0),
      tajwid: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.kesalahan_tajwid), 0),
      mad: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.kesalahan_mad), 0),
      qalqalah: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.kesalahan_qalqalah ?? entry.kesalahan_ghunnah), 0),
      kelancaran: getRataKelancaran(entries),
    });
  }

  if (mode === "Tahsin Lanjutan") {
    const entries = Array.isArray(aspek.entries) ? aspek.entries : [];

    return generateCatatanOtomatis({
      mode: "Tahsin Lanjutan",
      nilaiAkhir,
      namaSiswa: studentName,
      lahnJali: entries.reduce(
        (sum: number, entry: any) =>
          sum + toNumber(entry.salah_huruf) + toNumber(entry.salah_harakat) + toNumber(entry.salah_tasydid ?? entry.salah_makhraj),
        0
      ),
      lahnKhofi: entries.reduce(
        (sum: number, entry: any) =>
          sum + toNumber(entry.kesalahan_tajwid) + toNumber(entry.kesalahan_mad) + toNumber(entry.kesalahan_qalqalah ?? entry.kesalahan_ghunnah),
        0
      ),
      waqaf: entries.reduce((sum: number, entry: any) => sum + toNumber(entry.waqaf_ibtida ?? entry.kesalahan_waqaf), 0),
      kelancaran: getRataKelancaran(entries),
    });
  }

  return "";
}

export function getEffectiveCatatanGuru(
  ujian: any,
  studentName?: string
) {
  const aspek = ujian?.nilai_aspek || {};
  const savedCatatanMode = aspek.catatanMode || "auto";
  const savedCatatan = String(aspek.catatanGuru || aspek.catatan_guru || "").trim();

  if (savedCatatanMode === "manual" && savedCatatan) {
    return savedCatatan;
  }

  return generateCatatanOtomatisFromUjian(ujian, studentName);
}
