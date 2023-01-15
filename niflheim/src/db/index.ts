import mongoose from "mongoose";
import dotenv from 'dotenv';
import { ERROR_MESSAGES } from "../errorHandlers/errorMessages";

dotenv.config();
let dbo: typeof mongoose


const { DB_USERNAME, DB_PASSWORD } = process.env;
const { CONNECTION_ERROR } = ERROR_MESSAGES.DB
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@vanaheim.3pp4ugc.mongodb.net/?retryWrites=true&w=majority`;

const initDb = async () => {
    try {
        if (!dbo) {
            const connection = await mongoose.connect(uri)
            if (connection) {
                console.log('Connected to database ')
                dbo = connection;
            }
        }
    } catch (err: any) {
        console.error(`${CONNECTION_ERROR} \n${err}`);
        throw new Error(CONNECTION_ERROR)
    }
}

const getDbo = () => {
    return dbo;
}



export default {
    initDb,
    getDbo
}