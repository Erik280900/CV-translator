import mongoose from 'mongoose';

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MongoDB URI is missing");

  if (mongoose.connections[0].readyState) return;
  
  await mongoose.connect(MONGODB_URI);
}
