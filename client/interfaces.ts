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
    code : string, 
    user : {
        seen : boolean, 
    }
    image : string, 
}

export interface SliderProps {
    data: Episode[], 
    id:string
}

export interface User{
    login : string,
    subscription : Date, 
    stats : {
        friends : number,
        shows : number, 
        episodes_to_watch : number, 
        xp : 0, 
    }
    avatar: string|null, 
    id : number, 
}