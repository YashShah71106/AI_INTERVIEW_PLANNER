import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from "node:dns";

dotenv.config()



async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)

        console.log("CONNECTED TO DATABASE SUCCESSFULLY", Date());

    } catch (error) {
        console.error(error);
    }

}

export default connectDB