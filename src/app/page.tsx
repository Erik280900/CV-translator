"use client";

import PDFPreview from "@/components/PDFPreview";
import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [translatedUrl, setTranslatedUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return alert("Por favor selecciona un archivo.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.cv?.filePath) {
      setUploadedFilePath(data.cv.filePath); // Guardamos la ruta del archivo subido
      alert("Archivo subido con éxito");
    } else {
      alert("Error al subir el archivo");
    }
  }

  async function handleTranslate() {
    if (!uploadedFilePath) return;

    const res = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        filePath: uploadedFilePath,
        toLang: "en", // Puedes cambiar a "es" si quieres traducir de regreso
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.translatedUrl) {
      // Abre el nuevo PDF traducido en otra pestaña
      setTranslatedUrl(data.translatedUrl);
      window.open(data.translatedUrl, "_blank");
    } else {
      alert("Error al traducir el PDF");
    }
  }

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sube tu CV en PDF</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="cv">Selecciona tu CV:</label>
        <input
          id="cv"
          type="file"
          accept="application/pdf"
          className="block mt-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          type="submit"
        >
          Subir
        </button>
      </form>

      {uploadedFilePath && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleTranslate}
        >
          Traducir a Inglés y Descargar
        </button>
      )}

      {translatedUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Vista previa del CV traducido</h2>
          <iframe
            src={translatedUrl}
            className="w-full h-[600px] border rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}
