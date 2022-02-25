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
    user : {
        status : number, 
        remaining: number,
        favorited : boolean, 
        archived : boolean, 
        next : {
            id : number, 
            code :string, 
            title : string,
            image : string,
        }
    }
   
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
    date: string, 
    episode : number, 
    description : string,
    note : {
        mean : number
    } 
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