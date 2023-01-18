import { SongSchema } from "../../../models/Song";
import { Audio, MediaSources } from "../../../types";
import { TakeTonesSong } from "../types";

const getModifiedSongId = (song: TakeTonesSong) => {
    let modifiedSongId = `${MediaSources.TakeTones.toString()}-${song.id.toString()}`
    return modifiedSongId;
}

export const getTransformedSong = (song: TakeTonesSong) => {
    let transformedSong: SongSchema = {
        id: getModifiedSongId(song),
        name: song.name,
        audio: getAudio(song),
        authorName: song.author_name,
        description: song.description,
        tags: song.tags,
        source: MediaSources.TakeTones
    };
    return transformedSong;
}

const getAudio = (song: TakeTonesSong) => {
    const audio: Audio = {
        url: '',
        duration: ''
    }
    const fullSong = song.audio.find((audio) => {
        return audio.name === 'full'
    })
    if (fullSong) {
        audio.url = fullSong.url
        audio.duration = fullSong.duration
    }
    return audio;
}
