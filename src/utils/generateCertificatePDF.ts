import jsPDF from "jspdf";
import QRCode from "qrcode";
import logoSekolah from "@/assets/logo.png";

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

  doc.setDrawColor(180, 140, 50);

  for (let i = 0; i < 8; i++) {
    doc.circle(25 + i * 35, 25, 1, "F");
    doc.circle(25 + i * 35, h - 25, 1, "F");
  }
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

  // Background
  doc.setFillColor(250, 248, 240);
  doc.rect(0, 0, w, h, "F");

  // Decorative bands
  doc.setFillColor(240, 247, 240);
  doc.rect(0, 0, w, 18, "F");
  doc.rect(0, h - 18, w, 18, "F");

  drawBorder(doc, w, h);

  // Logo
  try {
    doc.addImage(logoSekolah, "PNG", 20, 20, 32, 32);
  } catch (err) {
    console.error("Logo error:", err);
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);

  doc.setFontSize(28);
  doc.text("SERTIFIKAT TAHFIZH", w / 2, 38, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(180, 140, 50);

  doc.text("AL-QUR'AN", w / 2, 48, {
    align: "center",
  });

  // Number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);

  doc.text(
    `No. ${safeText(data.nomorSertifikat)}`,
    w / 2,
    58,
    {
      align: "center",
    },
  );

  // Main Text
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);

  doc.text(
    "Diberikan kepada:",
    w / 2,
    75,
    {
      align: "center",
    },
  );

  // Student Name
  let nameSize = 30;

  doc.setFont("helvetica", "bold");

  while (
    doc.getTextWidth(safeText(data.studentName)) > 180 &&
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
    92,
    {
      align: "center",
    },
  );

  // Underline
  const lineWidth = doc.getTextWidth(
    safeText(data.studentName),
  );

  doc.setDrawColor(180, 140, 50);

  doc.line(
    w / 2 - lineWidth / 2 - 4,
    96,
    w / 2 + lineWidth / 2 + 4,
    96,
  );

  // Class
  doc.setFont("helvetica", "normal");

  doc.setFontSize(12);

  doc.setTextColor(60, 60, 60);

  doc.text(
    `Kelas ${safeText(data.className)}`,
    w / 2,
    108,
    {
      align: "center",
    },
  );

  // Description
  doc.text(
    `Telah menyelesaikan Sertifikasi Tahfizh Juz ${safeText(data.juz)}`,
    w / 2,
    120,
    {
      align: "center",
    },
  );

  // Score Box
  const boxW = 120;
  const boxH = 24;
  const boxX = (w - boxW) / 2;
  const boxY = 128;

  doc.setFillColor(240, 248, 240);

  doc.roundedRect(
    boxX,
    boxY,
    boxW,
    boxH,
    3,
    3,
    "F",
  );

  doc.setDrawColor(22, 101, 52);

  doc.roundedRect(
    boxX,
    boxY,
    boxW,
    boxH,
    3,
    3,
    "S",
  );

  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.setTextColor(100, 100, 100);

  doc.text("Nilai", boxX + 30, boxY + 8, {
    align: "center",
  });

  doc.text("Predikat", boxX + 90, boxY + 8, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");

  doc.setFontSize(18);

  doc.setTextColor(22, 101, 52);

  doc.text(
    String(data.nilaiAkhir || 0),
    boxX + 30,
    boxY + 18,
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
    boxY + 18,
    {
      align: "center",
    },
  );

  doc.setDrawColor(200, 200, 200);

  doc.line(
    boxX + 60,
    boxY + 4,
    boxX + 60,
    boxY + 20,
  );

  // Date
  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.setTextColor(90, 90, 90);

  doc.text(
    `Ditetapkan pada ${safeDate(data.tanggal)}`,
    w / 2,
    165,
    {
      align: "center",
    },
  );

  // Signature
  doc.setFontSize(9);

  doc.text(
    "Kepala Sekolah",
    w - 60,
    185,
    {
      align: "center",
    },
  );

  doc.line(
    w - 85,
    210,
    w - 35,
    210,
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    "__________________",
    w - 60,
    214,
    {
      align: "center",
    },
  );

  // Footer
  doc.setFont("helvetica", "normal");

  doc.setFontSize(7);

  doc.setTextColor(130, 130, 130);

  doc.text(
    "SDIT Luqmanul Hakim • Program Tahfizh",
    w / 2,
    h - 10,
    {
      align: "center",
    },
  );

  // QR
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
      w - 42,
      h - 42,
      24,
      24,
    );

    doc.setFontSize(7);

    doc.text(
      "Verifikasi",
      w - 30,
      h - 14,
      {
        align: "center",
      },
    );
  } catch (err) {
    console.error("QR ERROR:", err);
  }

  // PREVIEW PDF
  const blobUrl = doc.output("bloburl");

  window.open(blobUrl, "_blank");
};
