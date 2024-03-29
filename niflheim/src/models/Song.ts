import { model, Schema } from "mongoose"
import { Audio, SongTag } from "../types"

export interface SongSchema {
    id: string,
    name: string,
    description: string,
    authorName: string,
    tags: SongTag[],
    audio: Audio,
    source: string,
    isUsed?: string[]
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
    source: String,
    isUsed: Array
})

export const Song = model<SongSchema>('Song', songSchema)