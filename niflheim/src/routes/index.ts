import { Request, Response, Router } from "express";
import { AudioService } from "../services/AudioService";
import { SongsData } from "../types";
import dotenv from 'dotenv';
import { MediaService } from "../services/MediaConcat";

dotenv.config();
const router = Router();
const { FINAL_SONG_FOLDER_PATH } = process.env

/**
 * Accepts duration as a query param
 * Duration is in mins
 */
router.get('/songs', async (req: Request, res: Response) => {
    const { query } = req;
    let { duration, outputFileName = 'output', tag = 'ambient' } = query;
    if (duration) {
        let durationInNum = parseFloat(duration as string);
        if (Number.isNaN(durationInNum))
            return res.sendStatus(400)

        let songsData: SongsData = {
            songs: [],
            total: 0,
            totalDuration: 0
        }
        const downloadedSongs = []
        const existingFiles = []
        let downloadedFilesLocation = ''
        let mergedFilesLocation = ''
        let isConcatenationSuccessful = false;

        const audioService = new AudioService();
        const mediaService = new MediaService()

        /**
         * Get list of songs that have not been used already and whose duration adds up to provided duration
         */
        try {
            songsData = await audioService.getSongsForDuration(durationInNum, tag as string);
        } catch (err) {
            console.log(err)
            return res.status(500).send(err);
        }

        /**
         * Attempt to download the songs fetched above. If the songs already exist, they won't be re downloaded
         */
        try {
            const date = new Date();
            const folderName = `${FINAL_SONG_FOLDER_PATH}/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.valueOf()}`
            for (let i = 0; i < songsData.songs.length; i++) {
                const fileName = `${songsData.songs[i].id}-${songsData.songs[i].name}-${tag as string}`
                const response = await audioService.downloadSong(songsData.songs[i].audio.url, fileName, folderName)
                const { isNewDownload} = response;
                if (isNewDownload) {
                    downloadedSongs.push(songsData.songs[i]);
                } else {
                    existingFiles.push(songsData.songs[i])
                }
                downloadedFilesLocation = folderName
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }


        /**
         * Use concatenation service to merge the above audio files 
         */
        try {
            const response = await mediaService.concatenateAudios({
                fileFormat: 'mp3',
                inputFolderLocation: downloadedFilesLocation,
                outputFolderLocation: downloadedFilesLocation,
                outputFileName: outputFileName as string
            })
            isConcatenationSuccessful = true;
            mergedFilesLocation = response.file;
        } catch (err) {
            console.log("Error while concatenating audios", err)
            return res.status(500).send({
                message: `Error while concatenating audios - ${err.message}`
            });
        }

        /**
         * Add current tag to isUsed for above songs if they have been merged succesfully
         */
        if (isConcatenationSuccessful) {
            console.log("All songs are merged.")
            try {
                for(let i=0; i<songsData.songs.length; i++){
                    await audioService.setAudioIsUsedForTag(songsData.songs[i], tag as string);
                }
                return res.status(200).send({
                    mergedFilesLocation
                })
            } catch (err) {
                console.log("Error while updating isUsed flag");
                return res.status(500).send({
                    message: `"Error while updating isUsed flag - ${err.message}`
                });
            }
        }

    } else {
        return res.sendStatus(400);
    }



})


export { router as AppRouter }