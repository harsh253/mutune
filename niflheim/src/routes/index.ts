import { Request, Response, Router } from "express";
import { Song, SongSchema } from '../models/Song';
import { AudioService } from "../services/AudioService";
import { SongsData } from "../types";

const router = Router();

/**
 * Accepts duration as a query param
 * Duration is in mins
 */
router.get('/songs', async (req: Request, res: Response) => {
    const { query } = req;
    let { duration } = query;
    if (duration) {
        let durationInNum = parseFloat(duration as string);
        if (Number.isNaN(durationInNum))
            return res.sendStatus(400)

        let songsData: SongsData = {
            songs: [],
            total: 0,
            totalDuration: 0
        }

        const audioService = new AudioService();

        /**
         * Get list of songs that have not been used already
         */
        try {
            songsData = await audioService.getSongsForDuration(durationInNum);
        } catch (err) {
            console.log(err)
            return res.status(500).send(err);
        }

        /**
         * Attempt to download songs that have not been used already
         */
        try {
            const downloadedSongs = []
            const existingFiles = []
            for (let i = 0; i < songsData.songs.length; i++) {
                const downloadedFileUrl = await audioService.downloadSong(songsData.songs[i].audio.url, songsData.songs[i].id)
                if (downloadedFileUrl) {
                    downloadedSongs.push(songsData.songs[i]);
                }else{
                    existingFiles.push(songsData.songs[i])
                }
            }
            return res.status(200).send({ downloadedSongs, total: downloadedSongs.length, existingFiles })
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }

    } else {
        return res.sendStatus(400);
    }



})


export { router as AppRouter }