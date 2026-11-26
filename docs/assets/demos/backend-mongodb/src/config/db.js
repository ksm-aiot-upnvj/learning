import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_HOST, {
      dbName: process.env.DB_NAME,
    });
    console.log(`MongoDB Terhubung: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Gagal koneksi MongoDB: ${error.message}`);
    process.exit(1);
  }
};