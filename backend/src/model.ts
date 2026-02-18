
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const DB_URL = process.env.MONGO_URL

mongoose.connect(DB_URL!);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    privateKey: String,
    publicKey: String
})

export const userModel = mongoose.model("users", UserSchema);