import mongoose from "mongoose";

export const connectDB = async() =>{

        try {
                const mongoURI = process.env.MONGO_URI

                if(!mongoURI)
                        throw new Error("MONGO_URI is not defined in environment variables");

                const connection = await mongoose.connect(mongoURI,{dbName:'chatifyDB'});
                console.log(`MongoDB connected: ${connection.connection.host}`);
        } catch (error) {
                console.error(`Error connecting to MongoDB: ${error.message}`);
                process.exit(1); // Exit process with failure
        }
}