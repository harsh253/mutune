import { TakeTonesApi } from "../sources/TakeTones/api";
import { MediaSources } from "../types";

export class AppMediaSource {
    mediaSource: MediaSources
    sourceApiMap = new Map([[MediaSources.TakeTones, TakeTonesApi]])
    mediaApiSource: TakeTonesApi

    constructor(mediaSource: MediaSources) {
        try {
            this.mediaSource = mediaSource;
            const ApiSource = this.sourceApiMap.get(mediaSource);
            if (ApiSource) {
                this.mediaApiSource = new ApiSource();
                console.log(`Selected source - ${mediaSource}`)
            } else {
                throw new Error("No config found for given source")
            }
        }
        catch (err) {
            console.log(`Could not initiate App Media Source. Provided source - ${mediaSource}`)
            console.error(err);
            throw new Error(err)
        }
    }

    async extractAllSongs(tag?: string) {
        try {
            const songs = await this.mediaApiSource.extractAllSongs(tag);
            return songs;
        } catch (err) {
            console.log("Could not extract all songs")
            console.error(err);
        }
    }

}