export interface TakeTonesSongTag {
    name: String,
    slug: String
}

export interface TakeTonesSongImage {
    thumbnail?: String,
    background?: String
}

export interface TakeTonesAudio {
    id: number,
    url: String,
    name: String,
    duration: String,
    format: String,
    type: String,
    waveform: any[],
    waveform_link: String
}

export interface TakeTonesSearchSongResponse {
    data: TakeTonesSong[],
    links: any,
    meta: any
}

export interface TakeTonesSong {
    id: number | string,
    name: String,
    description: String,
    author_name: String,
    images: TakeTonesSongImage[],
    tags: TakeTonesSongTag[],
    audio: TakeTonesAudio[],
    preview: TakeTonesAudio[],
    is_favorite: Boolean,
    position: number,
    prices: any[],
    tempo: String,
    extra: {
        is_free: Boolean,
        has_content_id: Boolean
    },
    created_at: String
}