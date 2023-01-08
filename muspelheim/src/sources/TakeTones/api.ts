import axios, { AxiosResponse } from "axios"
import { TAKE_TONES_BASE_URL } from "./constants"
import { getTransformedSong } from "./dts/songDts";
import { TakeTonesSearchSongResponse } from "./types";
import { MediaApis, MediaSources } from "../../types";
import { SongSchema } from "../../models/Song";

export class TakeTonesApi implements MediaApis {
    SOURCE = MediaSources.TakeTones;

    searchSongs = async (page: number, tag: string = "ambient") => {
        try {
            const response = await axios.get(`https://${TAKE_TONES_BASE_URL}/public/tracks/search?type=genres&tag=${tag}&page=${page}`)
            return response as AxiosResponse<TakeTonesSearchSongResponse>;
        } catch (err) {
            console.log(`Something went wrong while fetching songs from taketones for page - ${page}`);
            console.error(err);
        }
    }

    extractAllSongs = async (tag: string = "ambient") => {
        console.log(`Fetching songs for tag - ${tag}`)
        let currentPage = 1;
        let hasNext = true;
        const songs: SongSchema[] = [];
        while (hasNext) {
            const response = await this.searchSongs(currentPage++, tag);
            if (response) {
                const { data } = response;
                const { links = {}, data: songList } = data;
                const transformedSongList = songList.map((song) => {
                    return getTransformedSong(song);
                })
                songs.push(...transformedSongList);
                hasNext = Boolean(links.next);
            }else{
                break;
            }
        }
        console.log(`Fetched ${songs.length} songs`);
        return songs;
    }


}