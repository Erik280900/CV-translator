import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CV from "@/models/CV";
import path from "path";
import fs from "fs/promises";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = Date.now() + "-" + file.name;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  await connectDB();
  const saved = await CV.create({
    originalName: file.name,
    filePath: `/uploads/${fileName}`,
    language: "es",
  });

  return NextResponse.json({ message: "Upload successful", cv: saved });
}
