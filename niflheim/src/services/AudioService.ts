import mongoose from "mongoose";
import db from "../db";
import { Song, SongSchema } from '../models/Song';

export class AudioService {
    dbo: typeof mongoose;
    constructor() {
        this.dbo = db.getDbo();
    }

    getSongsForDuration = (duration: number) => {
        
    }
}