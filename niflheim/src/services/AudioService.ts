import { ERROR_MESSAGES } from '../errorHandlers/errorMessages';
import { Song } from '../models/Song';

const { SONG_LIST_GENERATION_ERROR, DURATION_MISSING } = ERROR_MESSAGES.AUDIO_SERVICE;

export class AudioService {

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

}