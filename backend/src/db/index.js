import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        // Accept both MONGODB_URI (our convention) and MONGODB_URL (legacy)
        const baseUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
        if (!baseUri) {
            throw new Error("MONGODB_URI / MONGODB_URL is not set");
        }
        // Atlas URIs usually end with "/<db>" already; append our DB_NAME only
        // when the URI has no path component.
        const hasDbPath = /:\d+\/[\w-]+(\?|$)/.test(baseUri);
        const uri = hasDbPath ? baseUri : `${baseUri}/${DB_NAME}`;
        const connectionInstance = await mongoose.connect(uri)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB