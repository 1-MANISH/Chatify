import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async() =>{

        try {
                const mongoURI = ENV.MONGO_URI

                if(!mongoURI)
                        throw new Error("MONGO_URI is not defined in environment variables");

                const connection = await mongoose.connect(mongoURI,{dbName:'chatifyDB'});
                console.log(`MongoDB connected: ${connection.connection.host}`);
        } catch (error) {
                console.error(`Error connecting to MongoDB: ${error.message}`);
                process.exit(1); // Exit process with failure
        }
}