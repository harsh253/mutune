import { SongSchema } from "../../../models/Song";
import { Audio, MediaSources, SongTag } from "../../../types";
import { TakeTonesSong } from "../types";

const getModifiedSongId = (song: TakeTonesSong) => {
    let modifiedSongId = `${MediaSources.TakeTones.toString()}-${song.id.toString()}`
    return modifiedSongId;
}

export const getTransformedSong = (song: TakeTonesSong, tag: string) => {
    let transformedSong: SongSchema = {
        id: getModifiedSongId(song),
        name: song.name,
        audio: getAudio(song),
        authorName: song.author_name,
        description: song.description,
        tags: tagAudio(song, tag),
        source: MediaSources.TakeTones
    };
    return transformedSong;
}

const tagAudio = (song: TakeTonesSong, tag: string) => {
    const existingTags = song.tags;
    const isTagPresent = existingTags.find((existingTag) => existingTag.slug.toLowerCase() === tag.toLowerCase());
    if(!isTagPresent){
        song.tags.push({
            name: tag.toUpperCase(),
            slug: tag.toLowerCase()
        })
    }
    return song.tags;
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
