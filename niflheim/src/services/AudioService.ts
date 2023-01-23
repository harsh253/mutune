import { ERROR_MESSAGES } from '../errorHandlers/errorMessages';
import { Song, SongSchema } from '../models/Song';
import dotenv from 'dotenv';
import { downloadFromURL } from '../utils';

dotenv.config();
const { SONG_LIST_GENERATION_ERROR, DURATION_MISSING } = ERROR_MESSAGES.AUDIO_SERVICE;


export class AudioService {
    /**
     * 
     * @param duration Durationn of final song
     * @returns an object with array of songs to be merged. Also returns totalDuration of final song and total songs merged
     */
    getSongsForDuration = async (duration: number, tag:string) => {
        if (duration) {
            const requiredDurationInSec = duration * 60
            const songsToMerge = []
            let index = 0;
            let durationSum = 0;
            try {
                let firstUnusedSong = await Song.findOne({ isUsed: { $ne: tag }, "tags.slug": { $in: [tag] } })
                if (firstUnusedSong) {
                    songsToMerge.push(firstUnusedSong);
                    index += 1;
                    durationSum += parseFloat(firstUnusedSong.audio.duration as string);

                    const requiredSongsListCursor = Song.find({ _id: { $gt: firstUnusedSong._id } }).cursor();
                    for (let nextSong = await requiredSongsListCursor.next(); nextSong != null && durationSum <= requiredDurationInSec; nextSong = await requiredSongsListCursor.next()) {
                        if (nextSong.isUsed.includes(tag)) continue;

                        songsToMerge.push(nextSong);
                        durationSum += parseFloat(nextSong.audio.duration as string);
                        index += 1;
                    }
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

    async setAudioIsUsedForTag(song: SongSchema, tag: string) {
        const filter = { id: song.id }
        const update = {
            $addToSet: { isUsed: tag }
        }
        try {
            await Song.findOneAndUpdate(filter, update);
        } catch (err) {
            console.log(err)
            console.log("Could not update isUsed flag for -", song)
        }
    }

    async downloadSong(url: string, filename: string, outputFolder: string) {

        if (outputFolder) {
            try {
                console.log("Attempting to downloading file", filename)
                const isDownloaded = await downloadFromURL({ url, outputFolder, filename, fileFormat: 'mp3' });
                return {
                    isNewDownload: isDownloaded
                }
            } catch (err) {
                console.log(err)
                throw new Error(err);
            }
        } else {
            throw new Error("Output Folder not provided");
        }
    }

}