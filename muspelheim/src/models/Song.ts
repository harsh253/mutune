import { model, Schema } from "mongoose"
import { Audio, MediaSources, SongTag } from "../types"

export interface SongSchema {
    id: String,
    name: String,
    description: String,
    authorName: String,
    tags: SongTag[],
    audio: Audio,
    source: MediaSources
}

const songSchema = new Schema({
    id: String,
    name: String,
    description: String,
    authorName: String,
    tags: Array,
    audio: {
        type: Object,
        required: true
    },
    source: String
})

export const Song = model<SongSchema>('Song', songSchema)