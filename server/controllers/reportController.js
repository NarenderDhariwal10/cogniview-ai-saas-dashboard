// server/controllers/reportController.js
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";

const sampleData = [
  { name: "Narender", email: "narender@example.com", role: "Admin" },
  { name: "Tushar", email: "tushar@example.com", role: "Editor" },
  { name: "Priya", email: "priya@example.com", role: "Viewer" },
];

export const exportCSV = async (req, res) => {
  try {
    const json2csv = new Parser({ fields: ["name", "email", "role"] });
    const csv = json2csv.parse(sampleData);
    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error generating CSV", error: err.message });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const doc = new PDFDocument();
    const filename = "report.pdf";
    res.setHeader("Content-disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("User Report", { align: "center" });
    doc.moveDown();

    sampleData.forEach((u, i) => {
      doc.fontSize(12).text(`${i + 1}. ${u.name} | ${u.email} | ${u.role}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Error generating PDF", error: err.message });
  }
};
