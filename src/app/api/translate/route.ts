import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { default as translate } from "google-translate-open-api";
import { Translate } from "@google-cloud/translate/build/src/v2"; // API oficial

// Instancia del traductor de Google Cloud
const translate = new Translate();

export async function POST(req: NextRequest) {
  const { filePath, toLang } = await req.json();

  if (!filePath || !toLang) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Ruta al archivo original
  const fullPath = path.join(process.cwd(), "public", filePath);

  try {
    // Leer y extraer texto del PDF
    const pdfBuffer = await fs.readFile(fullPath);
    const data = await pdfParse(pdfBuffer);
    const originalText = data.text;

    // 2. Traducir el texto con la API oficial de Google
    const [translatedText] = await translate.translate(originalText, toLang);

    // Crear nuevo PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    const lines = translatedText.split("\n");
    let y = page.getHeight() - 50;

    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: fontSize, font });
      y -= 18;
      if (y < 50) break;
    }

    const pdfBytes = await pdfDoc.save();

    const translatedFileName = `translated-${Date.now()}.pdf`;
    const translatedPath = path.join(process.cwd(), "public/uploads", translatedFileName);

    await fs.writeFile(translatedPath, pdfBytes);

    return NextResponse.json({
      message: "PDF traducido con éxito",
      translatedUrl: `/uploads/${translatedFileName}`,
    });
  } catch (err: any) {
  console.error("❌ Error en traducción:", err.message);
  return NextResponse.json({ error: "Error al traducir el PDF", details: err.message }, { status: 500 });
}
}
