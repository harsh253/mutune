import { model, Schema } from "mongoose"
import { Audio, SongTag } from "../types"

export interface SongSchema {
    id: String,
    name: String,
    description: String,
    authorName: String,
    tags: SongTag[],
    audio: Audio,
    source: String
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