import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to DB ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error in connecting to DB ${err}`);
  }
};

export default connectDB;
