export interface showData {
    id: number,
    images: {
        poster: string,
        show: string,
    },
    title: string,
    notes: {
        mean: number
    },
    genres: object,
    seasons: number,
    episodes: number,
    description: string,
    platforms: {
        svods: svod[]
    },
}

interface svod {
    logo: string,
    link_url: string,
}

export interface Episode {
    title: string,
    season: number,
    id: number,
}

export interface SliderProps {
    data: Episode[]
}