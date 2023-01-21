import { ERROR_MESSAGES } from '../errorHandlers/errorMessages';
import { Song } from '../models/Song';
import dotenv from 'dotenv';
import { downloadFromURL } from '../utils';

const { SONG_LIST_GENERATION_ERROR, DURATION_MISSING } = ERROR_MESSAGES.AUDIO_SERVICE;
const { FINAL_SONG_FOLDER_PATH } = process.env
dotenv.config();

export class AudioService {
    /**
     * 
     * @param duration Durationn of final song
     * @returns an object with array of songs to be merged. Also returns totalDuration of final song and total songs merged
     */
    getSongsForDuration = async (duration: number) => {
        if (duration) {
            const requiredDurationInSec = duration * 60
            const songsToMerge = []
            let index = 0;
            let durationSum = 0;
            try {
                let firstUnusedSong = await Song.findOne({ isUsed: { $in: [null, false] } })
                songsToMerge.push(firstUnusedSong);
                index += 1;
                durationSum += parseFloat(firstUnusedSong.audio.duration as string);

                const requiredSongsListCursor = Song.find({ _id: { $gt: firstUnusedSong._id } }).cursor();
                for (let nextSong = await requiredSongsListCursor.next(); nextSong != null && durationSum <= requiredDurationInSec; nextSong = await requiredSongsListCursor.next()) {
                    songsToMerge.push(nextSong);
                    durationSum += parseFloat(nextSong.audio.duration as string);
                    index += 1;
                }
                return {
                    songs: songsToMerge,
                    totalDuration: durationSum,
                    total: index
                }
            } catch (err) {
                console.log(err);
                throw new Error(SONG_LIST_GENERATION_ERROR)
            }
        } else {
            throw new Error(DURATION_MISSING)
        }
    }

    async downloadSong(url: string, filename: string) {
        const date = new Date();
        const outputFolder = FINAL_SONG_FOLDER_PATH
        if (outputFolder) {
            const folderName = `${outputFolder}/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            try {
                console.log("Attempting to downloading file", filename)
                return await downloadFromURL({ url, outputFolder: folderName, filename, fileFormat: 'mp3' });
            } catch (err) {
                console.log(err)
                throw new Error(err);
            }
        }else{
            throw new Error("Output Folder not provided");
        }
    }

}