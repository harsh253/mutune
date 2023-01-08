import { Request, Response, Router } from "express";
import { AppMediaSource } from "../modules/AppMediaSource";
import { SongService } from "../services/SongService";
import { ExtractMediaResponse, MediaSources } from "../types";

const router = Router();

router.get("/extract-media", async (req: Request, res: Response) => {
    const { type = 'song', source, tag }: { type?: String, source?: MediaSources, tag?: string } = req.query;
    if (!source) {
        console.log("Source missing from api");
        return res.status(400).send("Media source is missing");
    }

    try {
        const service = new SongService(source);
        const songs = await service.extractSongsFromMediaSource(tag);
        const response: ExtractMediaResponse = {
            data: {
                newSongs: songs,
                total: songs.length
            }
        }
        return res.status(200).send(response)
    } catch (err) {
        return res.status(200).send(err.message)
    }


})

export { router as AppRouter }