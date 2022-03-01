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
    length : number,
    user: UserData,
}

interface UserData {
    status: number,
    remaining: number,
    favorited: boolean,
    archived: boolean,
    next: {
        id: number,
        code: string,
        title: string,
        image: string,
    }
}

export interface ButtonProps {
    id: number, 
    isActive : boolean,
}

interface svod {
    logo: string,
    link_url: string,
}

export interface Episode {
    title: string,
    season: number,
    id: number,
    code: string,
    user: {
        seen: boolean,
    }
    image: string,
    date: string,
    episode: number,
    description: string,
    note: {
        mean: number
    }
}

export interface SliderProps {
    data: Episode[],
    id: string
}

export interface User {
    login: string,
    subscription: Date,
    stats: {
        friends: number,
        shows: number,
        episodes_to_watch: number,
        xp: 0,
        time_on_tv: number, 
        time_to_spend:number,
        favorite_genre : string, 
    }
    avatar: string | null,
    id: number,
}
