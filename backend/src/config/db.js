import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Database Migration: approved draft courses to published
    try {
      const result = await mongoose.connection.collection("courses").updateMany(
        { approvalStatus: "approved", status: "draft" },
        { $set: { status: "published" } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Migration complete: updated ${result.modifiedCount} approved draft courses to published.`);
      }
    } catch (migErr) {
      console.error("Migration failed:", migErr);
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;