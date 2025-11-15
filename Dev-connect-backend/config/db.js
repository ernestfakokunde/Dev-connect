import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI not provided — skipping MongoDB connection (dev mode)');
      return;
    }

    const conn  = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error.message)
    // Do not exit process here; allow server to start for frontend/UI development.
    // If DB is critical for production, ensure MONGO_URI is provided in that env.
  }
}
export default connectDB