import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState, MouseEvent } from "react";
import Header from "../Header";
import { showData, Episode } from "../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { getQueryParameter } from "../../utils";
import Dropper from "./Dropper";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showData>();
    const [episodes, setEpisodes] = useState<Episode[][]>([])
    const router = useRouter();
    const [openDroppers, setOpenDroppers] = useState<number[]>([]); 

    useEffect(() => {
        const id = getQueryParameter(window.location.pathname);
        fetch(`https://api.betaseries.com/shows/display?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.show) {
                    setData(res.show)
                    console.log(res.show.images.show)
                }
            })
            .catch(err => console.log(err));

        getEpisodes(id);
    }, []);

    const getEpisodes = (id: string) => {
        fetch(`https://api.betaseries.com/shows/episodes?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {

                if (res.episodes) {
                    const data = formatEpisodes(res.episodes)
                    setEpisodes(data);
                    console.log(data);
                }
            })
            .catch(err => console.log(err));
    }



    function formatEpisodes(episodes: Episode[]): Episode[][] {
        const data = [];
        let tmp = [];
        for (let i = 0; i < episodes.length; i++) {
            if (i > 0) {
                if (episodes[i].season !== episodes[i - 1].season) {
                    data.push(tmp);
                    tmp = [];
                }
            }
            tmp.push(episodes[i]);
        }
        data.push(tmp);
        return data;
    }


    const toggleDropper = (id:number) => {
        if(openDroppers.includes(id)){
            const i = openDroppers.indexOf(id);
            const tmpData = [...openDroppers]; 
            tmpData.splice(i, 1);
            setOpenDroppers(tmpData); 
        }
        else{
            setOpenDroppers([id, ...openDroppers]);
        }
    }

    return (
        <div>
            <Header />
            {data
                ? <div>
                    <div className="display-img" id="display-wrapper" style={{ backgroundImage: `url(${data.images.show})` }}></div>
                    <div className="display-wrapper">
                        {data.id !== undefined &&
                            <div className="series-display" >
                                <div className="display-top">
                                    <div>
                                        <h1>{data.title}</h1>
                                        <div className=" center horizontal">
                                            <StarOutlineIcon className="block" style={{ marginRight: ".5rem" }} />
                                            <span className="block">{data.notes.mean.toFixed(2)}</span>
                                        </div>
                                        {/* <img className="series-poster" src={data.images.poster} alt="" /> */}
                                        {Object.values(data.genres).map(v =>
                                            <span className="lgt-blue">{v} </span>
                                        )}
                                        <p>{`${data.seasons} saison${data.seasons > 1 ? "s" : ""}`} </p>
                                        <p style={{ marginBottom: "2rem" }}>{`${data.episodes} épisode${data.episodes > 1 ? "s" : ""}`} </p>
                                    </div>
                                    {/* <img src={data.images.poster} alt="" /> */}
                                </div>
                                <p>{data.description}</p>
                                <div>
                                    <p className="mid-title">Où regarder : </p>
                                    <div className="vod-container">
                                        {data.platforms.svods.map(v =>
                                            <div>
                                                <a href={v.link_url} target="_blank">
                                                    <img src={v.logo} className="vod-logo" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="episode-list-container">
                                    <p className="mid-title">Episodes </p>
                                    {episodes.length > 0
                                        ? episodes.map((v: Episode[], i: number) =>
                                            <div >
                                                <div className="dropper-title">
                                                    <div className="horizontal sp-b" onClick={()=>toggleDropper(i)}>
                                                        <p className="mid-title lgt-blue">Saison {i + 1}</p>
                                                        <ArrowDropDownCircleIcon sx={{ color: "#BFD7ED", fontSize: "2rem", cursor :"pointer" }} />
                                                    </div>
                                                    <hr />
                                                </div>
                                                {openDroppers.includes(i) &&
                                                    <Dropper data={v} id={`dropper-${i}`} />
                                                }
                                            </div>

                                        )
                                        : <CircularProgress />
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

                : <CircularProgress />}
        </div>
    );
}