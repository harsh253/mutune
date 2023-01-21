import { SongSchema } from "./models/Song"

export interface SongTag { 
    name: String,
    slug: String
}

export interface Audio {
    url: string,
    duration: string // in seconds
}

export interface SongsData{
    songs: Array<SongSchema>,
    totalDuration: number,
    total: number
}