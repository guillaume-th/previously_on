export interface showData {
    id : number, 
    images: {
        poster: string, 
        show : string,
    },
    title : string,
    notes: {
        mean : number
    }, 
    genres : string[], 
    seasons : number, 
    episodes : number, 
    description : string, 

}
