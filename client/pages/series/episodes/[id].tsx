import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../Header";
import { Episode } from "../../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<Episode>();
    const [image, setImage] = useState(null);
    const [background, setBackGround] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const id = getId();
        fetch(`https://api.betaseries.com/episodes/display?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.episode) {
                    setData(res.episode)
                    getBackground(id,res.episode.season);
                }
            })
            .catch(err => console.log(err));
            getImage(id);

    }, []);

    const getImage = (id: string) => {
    fetch(`https://api.betaseries.com/pictures/episodes?id=${id}&client_id=${API_KEY}`)
    .then(res => {
        console.log(res);
        if (res.url) {
            setImage(res.url)
        }
    })
    .catch(err => console.log(err));
    }
    const getBackground = (id: string,id_season: string) => {
        fetch(`https://api.betaseries.com/pictures/seasons?show_id=${id}&season=${id_season}&client_id=${API_KEY}`)
        .then(res => {
            console.log(res);
            if (res.url) {
                setBackGround(res.url)
            }
        })
        .catch(err => console.log(err));
        }


    const getId = () => {
        let { id } = router.query;
        if (id === undefined) {
            const path = window.location.pathname;
            const slashIndex: number | undefined = path.lastIndexOf("/");
            id = path.slice(slashIndex + 1, path.length);
        }
        return id;
    }

    return (
        <div>
            <Header />
            {data
                ? <div>
                    <div className="display-img" id="display-wrapper" style={{ backgroundImage: `url(${background})` }}></div>
                    <div className="display-wrapper">
                        {data.id !== undefined &&
                            <div className="series-display" >
                                <h1>{data.title}</h1>
                                <div className=" center horizontal">
                                    <StarOutlineIcon className="block" style={{marginRight : ".5rem"}}/>

                                    <span className="block">{data.note.mean.toFixed(1)}</span>
                                    
                                </div>
                                <img src={image} alt="" />
                                <p>sortie : {data.date}</p>
                                <p>season n°{data.season}</p>
                                <p>episodes n°{data.episode}</p>
                                <p> Resumé : {data.description}</p>
                            </div>
                        }

                    </div>
                </div>

                : <CircularProgress />}
        </div>
    );
}