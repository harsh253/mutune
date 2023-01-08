import mongoose from "mongoose";
import db from "../db";
import { ERROR_MESSAGES } from "../errorHandlers/errorMessages";
import { AppMediaSource } from "../modules/AppMediaSource";
import { MediaSources } from "../types";
import { Song, SongSchema } from '../models/Song';

export class SongService {
    source: MediaSources;
    dbo: typeof mongoose;
    constructor(source: MediaSources,) {
        this.source = source;
        this.dbo = db.dbo;
    }

    extractSongsFromMediaSource = async (tag?: string) => {
        let apiSource: AppMediaSource
        const { SOURCE_INITIATE_ERROR, SONG_EXTRACT_ERROR } = ERROR_MESSAGES.API_SOURCE
        const { DATA_SAVE_ERROR } = ERROR_MESSAGES.DB;
        try {
            apiSource = new AppMediaSource(this.source);
        } catch (err) {
            console.log(err, `SOURCE - ${this.source}`);
            throw new Error(SOURCE_INITIATE_ERROR);
        }

        let songs: SongSchema[] | undefined;
        const savedSongs: SongSchema[] = []

        //extract songs
        try {
            songs = await apiSource.extractAllSongs(tag);
        } catch (err) {
            console.log(err);
            throw new Error(SONG_EXTRACT_ERROR);
        }

        //save song if not already present in db
        try {
            if (songs) {
                for (let i = 0; i < songs.length; i++) {
                    let song = new Song(songs[i]);
                    try {
                        const existingSong = await Song.findOne({ id: song.id });
                        if (!existingSong) {
                            const savedSong = await song.save() as SongSchema
                            savedSongs.push(savedSong);
                        }
                    } catch (error) {
                        throw new Error(error);
                    }
                }
                console.log(`Saved ${savedSongs.length} new songs`);
            } else {
                console.log(`No songs found for the given source - ${this.source}`);
            }
        } catch (err) {
            console.log(err);
            throw new Error(DATA_SAVE_ERROR)
        }

        return savedSongs;
    }
}
