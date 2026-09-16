import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongodb_connect = async () => {
  try {
    const connection_instances = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `✅ DB connected | HOST: ${connection_instances.connection.host}`
    );
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default mongodb_connect;
