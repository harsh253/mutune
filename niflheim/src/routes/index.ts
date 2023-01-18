import { Request, Response, Router } from "express";
import { Song, SongSchema } from '../models/Song';
import { AudioService } from "../services/AudioService";

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

        try {
            const audioService = new AudioService();
            const songs = await audioService.getSongsForDuration(durationInNum);
            return res.status(200).send(songs);
        } catch (err) {
            console.log(err)
            return res.status(500).send(err);
        }
    } else {
        return res.sendStatus(400);
    }



})


export { router as AppRouter }