import { Request, Response, Router } from "express";
import { Song, SongSchema } from '../models/Song';

const router = Router();

/**
 * Accepts duration as a query param
 * Duration is in mins
 */
router.get('/songs', async (req: Request, res: Response) => {
    const { query } = req;
    const { duration = '45' } = query;
    try {
        const songs = await Song.find();
        return res.status(200).send(songs);
    } catch (err) {
        return res.status(500).send(err);
    }


})


export { router as AppRouter }