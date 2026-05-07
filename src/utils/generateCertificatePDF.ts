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

const drawBorder = (
  doc: jsPDF,
  w: number,
  h: number,
) => {
  // Outer Border
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(3);

  doc.rect(
    12,
    12,
    w - 24,
    h - 24,
  );

  // Inner Border
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(1);

  doc.rect(
    16,
    16,
    w - 32,
    h - 32,
  );

  // Decorative Dots
  doc.setDrawColor(180, 140, 50);

  for (let i = 0; i < 8; i++) {
    doc.circle(
      25 + i * 35,
      25,
      1,
      "F",
    );

    doc.circle(
      25 + i * 35,
      h - 25,
      1,
      "F",
    );
  }
};

export const generateCertificatePDF = async (
  data: CertificateData,
) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const w =
      doc.internal.pageSize.getWidth();

    const h =
      doc.internal.pageSize.getHeight();

    // ======================
    // BACKGROUND
    // ======================

    doc.setFillColor(250, 248, 240);

    doc.rect(
      0,
      0,
      w,
      h,
      "F",
    );

    // Decorative Bands
    doc.setFillColor(240, 247, 240);

    doc.rect(
      0,
      0,
      w,
      18,
      "F",
    );

    doc.rect(
      0,
      h - 18,
      w,
      18,
      "F",
    );

    drawBorder(doc, w, h);

    // ======================
    // LOGO
    // ======================

    if (logoSekolah) {
      try {
        doc.addImage(
          logoSekolah,
          "PNG",
          20,
          20,
          32,
          32,
        );
      } catch (err) {
        console.error(
          "Logo error:",
          err,
        );
      }
    }

    // ======================
    // TITLE
    // ======================

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setTextColor(
      22,
      101,
      52,
    );

    doc.setFontSize(28);

    doc.text(
      "SERTIFIKAT TAHFIZH",
      w / 2,
      38,
      {
        align: "center",
      },
    );

    doc.setFontSize(14);

    doc.setTextColor(
      180,
      140,
      50,
    );

    doc.text(
      "AL-QUR'AN",
      w / 2,
      48,
      {
        align: "center",
      },
    );

    // ======================
    // CERTIFICATE NUMBER
    // ======================

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(10);

    doc.setTextColor(
      120,
      120,
      120,
    );

    doc.text(
      `No. ${safeText(
        data.nomorSertifikat,
      )}`,
      w / 2,
      58,
      {
        align: "center",
      },
    );

    // ======================
    // MAIN TEXT
    // ======================

    doc.setFontSize(12);

    doc.setTextColor(
      60,
      60,
      60,
    );

    doc.text(
      "Diberikan kepada:",
      w / 2,
      75,
      {
        align: "center",
      },
    );

    // ======================
    // STUDENT NAME
    // ======================

    let nameSize = 30;

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setFontSize(nameSize);

    while (
      doc.getTextWidth(
        safeText(data.studentName),
      ) > 180 &&
      nameSize > 18
    ) {
      nameSize--;

      doc.setFontSize(nameSize);
    }

    doc.setTextColor(
      22,
      101,
      52,
    );

    doc.text(
      safeText(data.studentName),
      w / 2,
      92,
      {
        align: "center",
      },
    );

    // Underline
    const lineWidth =
      doc.getTextWidth(
        safeText(data.studentName),
      );

    doc.setDrawColor(
      180,
      140,
      50,
    );

    doc.setLineWidth(0.7);

    doc.line(
      w / 2 -
        lineWidth / 2 -
        4,
      96,
      w / 2 +
        lineWidth / 2 +
        4,
      96,
    );

    // ======================
    // CLASS
    // ======================

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(12);

    doc.setTextColor(
      60,
      60,
      60,
    );

    doc.text(
      `Kelas ${safeText(
        data.className,
      )}`,
      w / 2,
      108,
      {
        align: "center",
      },
    );

    // ======================
    // DESCRIPTION
    // ======================

    doc.text(
      `Telah menyelesaikan Sertifikasi Tahfizh Juz ${safeText(
        data.juz,
      )}`,
      w / 2,
      120,
      {
        align: "center",
      },
    );

    // ======================
    // SCORE BOX
    // ======================

    const boxW = 120;
    const boxH = 24;

    const boxX =
      (w - boxW) / 2;

    const boxY = 128;

    doc.setFillColor(
      240,
      248,
      240,
    );

    doc.roundedRect(
      boxX,
      boxY,
      boxW,
      boxH,
      3,
      3,
      "F",
    );

    doc.setDrawColor(
      22,
      101,
      52,
    );

    doc.setLineWidth(0.5);

    doc.roundedRect(
      boxX,
      boxY,
      boxW,
      boxH,
      3,
      3,
      "S",
    );

    // Labels
    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(10);

    doc.setTextColor(
      100,
      100,
      100,
    );

    doc.text(
      "Nilai",
      boxX + 30,
      boxY + 8,
      {
        align: "center",
      },
    );

    doc.text(
      "Predikat",
      boxX + 90,
      boxY + 8,
      {
        align: "center",
      },
    );

    // Values
    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setFontSize(18);

    doc.setTextColor(
      22,
      101,
      52,
    );

    doc.text(
      Number(
        data.nilaiAkhir || 0,
      ).toFixed(0),
      boxX + 30,
      boxY + 18,
      {
        align: "center",
      },
    );

    doc.setFontSize(
      safeText(data.predikat)
        .length > 15
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

    // Separator
    doc.setDrawColor(
      200,
      200,
      200,
    );

    doc.line(
      boxX + 60,
      boxY + 4,
      boxX + 60,
      boxY + 20,
    );

    // ======================
    // DATE
    // ======================

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(10);

    doc.setTextColor(
      90,
      90,
      90,
    );

    doc.text(
      `Ditetapkan pada ${safeDate(
        data.tanggal,
      )}`,
      w / 2,
      165,
      {
        align: "center",
      },
    );

    // ======================
    // SIGNATURE SECTION
    // ======================

    const signBoxY = 174;

    const signBoxW = 70;
    const signBoxH = 38;

    // LEFT BOX
    const leftBoxX = 38;

    doc.setDrawColor(
      210,
      210,
      210,
    );

    doc.setFillColor(
      250,
      250,
      250,
    );

    doc.roundedRect(
      leftBoxX,
      signBoxY,
      signBoxW,
      signBoxH,
      2,
      2,
      "FD",
    );

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setFontSize(10);

    doc.setTextColor(
      22,
      101,
      52,
    );

    doc.text(
      "Koordinator Tahfizh",
      leftBoxX +
        signBoxW / 2,
      signBoxY + 8,
      {
        align: "center",
      },
    );

    doc.setDrawColor(
      120,
      120,
      120,
    );

    doc.setLineWidth(0.5);

    doc.line(
      leftBoxX + 10,
      signBoxY + 24,
      leftBoxX +
        signBoxW -
        10,
      signBoxY + 24,
    );

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(8);

    doc.setTextColor(
      90,
      90,
      90,
    );

    doc.text(
      "Nama Koordinator",
      leftBoxX +
        signBoxW / 2,
      signBoxY + 29,
      {
        align: "center",
      },
    );

    doc.text(
      "NIP. ........................",
      leftBoxX +
        signBoxW / 2,
      signBoxY + 34,
      {
        align: "center",
      },
    );

    // RIGHT BOX
    const rightBoxX =
      w - signBoxW - 38;

    doc.roundedRect(
      rightBoxX,
      signBoxY,
      signBoxW,
      signBoxH,
      2,
      2,
      "FD",
    );

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setFontSize(10);

    doc.setTextColor(
      22,
      101,
      52,
    );

    doc.text(
      "Kepala Sekolah",
      rightBoxX +
        signBoxW / 2,
      signBoxY + 8,
      {
        align: "center",
      },
    );

    doc.setDrawColor(
      120,
      120,
      120,
    );

    doc.line(
      rightBoxX + 10,
      signBoxY + 24,
      rightBoxX +
        signBoxW -
        10,
      signBoxY + 24,
    );

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(8);

    doc.setTextColor(
      90,
      90,
      90,
    );

    doc.text(
      "Nama Kepala Sekolah",
      rightBoxX +
        signBoxW / 2,
      signBoxY + 29,
      {
        align: "center",
      },
    );

    doc.text(
      "NIP. ........................",
      rightBoxX +
        signBoxW / 2,
      signBoxY + 34,
      {
        align: "center",
      },
    );

    // ======================
    // FOOTER
    // ======================

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(7);

    doc.setTextColor(
      130,
      130,
      130,
    );

    doc.text(
      "SDIT Luqmanul Hakim • Program Tahfizh",
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
      const qrData = `
SERTIFIKAT TAHFIZH
Nama: ${safeText(
        data.studentName,
      )}
Kelas: ${safeText(
        data.className,
      )}
Juz: ${safeText(data.juz)}
Nilai: ${safeText(
        data.nilaiAkhir,
      )}
Predikat: ${safeText(
        data.predikat,
      )}
No: ${safeText(
        data.nomorSertifikat,
      )}
Tanggal: ${safeDate(
        data.tanggal,
      )}
`;

      const qr =
        await QRCode.toDataURL(
          qrData,
          {
            width: 200,
            margin: 1,
          },
        );

      doc.addImage(
        qr,
        "PNG",
        w - 42,
        h - 42,
        24,
        24,
      );

      doc.setFontSize(7);

      doc.setTextColor(
        120,
        120,
        120,
      );

      doc.text(
        "Verifikasi",
        w - 30,
        h - 14,
        {
          align: "center",
        },
      );
    } catch (err) {
      console.error(
        "QR ERROR:",
        err,
      );
    }

    // ======================
    // PREVIEW PDF
    // ======================

    const blob =
      doc.output("blob");

    const blobUrl =
      URL.createObjectURL(blob);

    const previewWindow =
      window.open();

    if (previewWindow) {
      previewWindow.location.href =
        blobUrl;
    } else {
      alert(
        "Popup browser diblokir. Izinkan popup untuk preview PDF.",
      );
    }
  } catch (err) {
    console.error(
      "PDF GENERATE ERROR:",
      err,
    );

    alert(
      "Terjadi kesalahan saat membuat PDF sertifikat.",
    );
  }
};
