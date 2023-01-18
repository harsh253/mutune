import { AxiosResponse } from "axios";
import { SongSchema } from "./models/Song";
import { TakeTonesSearchSongResponse, TakeTonesSongTag } from "./sources/TakeTones/types";

export const enum MediaSources {
    TakeTones = 'takeTones'
}

export interface ExtractMediaResponse {
    data: {
        newSongs: SongSchema[],
        total: number
    }
}

export interface MediaApis {
    searchSongs: (page: number, tag?: string) => Promise<AxiosResponse<TakeTonesSearchSongResponse, any> | undefined>
}

export interface SongTag extends TakeTonesSongTag { }

export interface Audio {
    url: String,
    duration: String //in seconds
}
