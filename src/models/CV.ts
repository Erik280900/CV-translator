import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  translatedPath: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CV || mongoose.model("CV", cvSchema);
