import jsPDF from "jspdf";
import QRCode from "qrcode";

interface CertificateData {
  studentName: string;
  className: string;
  juz: string;
  nilaiAkhir: number;
  predikat: string;
  tanggal: string;
  nomorSertifikat: string;
}

const safeText = (value: any, fallback = "-") => {
  if (!value) return fallback;
  return String(value);
};

const safeDate = (value: string) => {
  const d = new Date(value);

  if (isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const safeFileName = (name: string) => {
  return name
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "_");
};

const drawBorder = (doc: jsPDF, w: number, h: number) => {
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(3);

  doc.rect(12, 12, w - 24, h - 24);

  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(1);

  doc.rect(16, 16, w - 32, h - 32);

  // corner ornaments
  doc.setFillColor(180, 140, 50);

  doc.circle(25, 25, 3, "F");
  doc.circle(w - 25, 25, 3, "F");
  doc.circle(25, h - 25, 3, "F");
  doc.circle(w - 25, h - 25, 3, "F");
};

export const generateCertificatePDF = async (
  data: CertificateData,
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ======================
  // BACKGROUND
  // ======================

  doc.setFillColor(250, 248, 240);
  doc.rect(0, 0, w, h, "F");

  doc.setFillColor(240, 247, 240);
  doc.rect(0, 0, w, 18, "F");
  doc.rect(0, h - 18, w, 18, "F");

  drawBorder(doc, w, h);

  // ======================
  // SIMPLE ISLAMIC LOGO
  // ======================

  const logoX = 34;
  const logoY = 30;

  // outer circle
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(1.2);

  doc.circle(logoX, logoY, 10);

  // inner circle
  doc.setDrawColor(180, 140, 50);

  doc.circle(logoX, logoY, 7);

  // moon
  doc.setFillColor(22, 101, 52);

  doc.circle(logoX - 2, logoY, 3, "F");

  doc.setFillColor(250, 248, 240);

  doc.circle(logoX - 1, logoY, 2.5, "F");

  // star
  doc.setFillColor(180, 140, 50);

  doc.circle(logoX + 4, logoY - 3, 1.2, "F");

  // school text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);

  doc.text(
    "SDIT",
    logoX,
    logoY + 15,
    {
      align: "center",
    },
  );

  // ======================
  // BISMILLAH
  // ======================

  doc.setFont("times", "italic");
  doc.setFontSize(18);
  doc.setTextColor(22, 101, 52);

  doc.text(
    "Bismillahirrahmanirrahim",
    w / 2,
    25,
    {
      align: "center",
    },
  );

  // ======================
  // TITLE
  // ======================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);

  doc.text(
    "SERTIFIKAT TAHFIZH AL-QUR'AN",
    w / 2,
    42,
    {
      align: "center",
    },
  );

  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.8);

  doc.line(70, 46, w - 70, 46);

  // subtitle

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(180, 140, 50);

  doc.text(
    "CERTIFICATE OF QUR'AN MEMORIZATION",
    w / 2,
    54,
    {
      align: "center",
    },
  );

  // ======================
  // NOMOR
  // ======================

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  doc.text(
    `No: ${safeText(data.nomorSertifikat)}`,
    w / 2,
    65,
    {
      align: "center",
    },
  );

  // ======================
  // CONTENT
  // ======================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);

  doc.text(
    "Diberikan kepada:",
    w / 2,
    82,
    {
      align: "center",
    },
  );

  // ======================
  // NAMA SISWA
  // ======================

  let nameSize = 28;

  doc.setFont("helvetica", "bold");

  while (
    doc.getTextWidth(safeText(data.studentName)) > 170 &&
    nameSize > 18
  ) {
    nameSize--;
    doc.setFontSize(nameSize);
  }

  doc.setFontSize(nameSize);
  doc.setTextColor(22, 101, 52);

  doc.text(
    safeText(data.studentName),
    w / 2,
    100,
    {
      align: "center",
    },
  );

  const lineWidth = doc.getTextWidth(
    safeText(data.studentName),
  );

  doc.setDrawColor(180, 140, 50);

  doc.line(
    w / 2 - lineWidth / 2 - 4,
    104,
    w / 2 + lineWidth / 2 + 4,
    104,
  );

  // ======================
  // KELAS
  // ======================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);

  doc.text(
    `Kelas: ${safeText(data.className)}`,
    w / 2,
    116,
    {
      align: "center",
    },
  );

  // ======================
  // DESKRIPSI
  // ======================

  doc.text(
    `Telah menyelesaikan Ujian Sertifikasi Tahfizh Al-Qur'an`,
    w / 2,
    128,
    {
      align: "center",
    },
  );

  doc.text(
    `untuk Juz ${safeText(data.juz)} dengan hasil:`,
    w / 2,
    138,
    {
      align: "center",
    },
  );

  // ======================
  // SCORE BOX
  // ======================

  const boxW = 120;
  const boxH = 28;
  const boxX = (w - boxW) / 2;
  const boxY = 146;

  doc.setFillColor(240, 248, 240);

  doc.roundedRect(
    boxX,
    boxY,
    boxW,
    boxH,
    4,
    4,
    "F",
  );

  doc.setDrawColor(22, 101, 52);

  doc.roundedRect(
    boxX,
    boxY,
    boxW,
    boxH,
    4,
    4,
    "S",
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  doc.text(
    "Nilai Akhir",
    boxX + 30,
    boxY + 10,
    {
      align: "center",
    },
  );

  doc.text(
    "Predikat",
    boxX + 90,
    boxY + 10,
    {
      align: "center",
    },
  );

  doc.line(
    boxX + 60,
    boxY + 5,
    boxX + 60,
    boxY + 23,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(22, 101, 52);

  doc.text(
    String(data.nilaiAkhir || 0),
    boxX + 30,
    boxY + 21,
    {
      align: "center",
    },
  );

  doc.setFontSize(
    safeText(data.predikat).length > 15
      ? 12
      : 16,
  );

  doc.text(
    safeText(data.predikat),
    boxX + 90,
    boxY + 21,
    {
      align: "center",
    },
  );

  // ======================
  // TANGGAL
  // ======================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);

  doc.text(
    `Ditetapkan pada tanggal ${safeDate(data.tanggal)}`,
    w / 2,
    188,
    {
      align: "center",
    },
  );

  // ======================
  // SIGNATURE
  // ======================

  const signY = 195;
  const signBoxW = 70;
  const signBoxH = 28;

  // LEFT

  const leftX = 32;

  doc.setFillColor(252, 252, 252);

  doc.roundedRect(
    leftX,
    signY,
    signBoxW,
    signBoxH,
    2,
    2,
    "FD",
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);

  doc.text(
    "Koordinator Tahfizh",
    leftX + signBoxW / 2,
    signY + 8,
    {
      align: "center",
    },
  );

  doc.setDrawColor(120, 120, 120);

  doc.line(
    leftX + 10,
    signY + 18,
    leftX + signBoxW - 10,
    signY + 18,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Nama Koordinator",
    leftX + signBoxW / 2,
    signY + 23,
    {
      align: "center",
    },
  );

  // RIGHT

  const rightX = w - signBoxW - 32;

  doc.roundedRect(
    rightX,
    signY,
    signBoxW,
    signBoxH,
    2,
    2,
    "FD",
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    "Kepala Sekolah",
    rightX + signBoxW / 2,
    signY + 8,
    {
      align: "center",
    },
  );

  doc.line(
    rightX + 10,
    signY + 18,
    rightX + signBoxW - 10,
    signY + 18,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Nama Kepala Sekolah",
    rightX + signBoxW / 2,
    signY + 23,
    {
      align: "center",
    },
  );

  // ======================
  // FOOTER
  // ======================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);

  doc.text(
    "SDIT Luqmanul Hakim • Program Tahfizh Al-Qur'an",
    w / 2,
    h - 10,
    {
      align: "center",
    },
  );

  // ======================
  // QR CODE
  // ======================

  try {
    const qrData = `SERTIFIKAT:${safeText(
      data.nomorSertifikat,
    )}`;

    const qr = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
    });

    doc.addImage(
      qr,
      "PNG",
      w - 40,
      h - 40,
      22,
      22,
    );

    doc.setFontSize(7);

    doc.text(
      "Verifikasi",
      w - 29,
      h - 14,
      {
        align: "center",
      },
    );
  } catch (err) {
    console.error("QR ERROR:", err);
  }

  // ======================
  // OPEN + DOWNLOAD
  // ======================

  const blobUrl = doc.output("bloburl");

  window.open(blobUrl, "_blank");

  doc.save(
    `Sertifikat_${safeFileName(
      data.studentName,
    )}.pdf`,
  );
};
