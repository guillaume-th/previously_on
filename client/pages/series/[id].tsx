import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../Header";
import { showData, Episode } from "../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { getQueryParameter } from "../../utils";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showData>();
    const [episodes, setEpisodes] = useState<object[][]>([])
    const router = useRouter();

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
        console.log(data); 
        return data; 

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
                                <div className="episode-list">
                                    <p className="mid-title">Episodes </p>
                                    {episodes.length > 0
                                        ? episodes.map(v =>
                                            <div>
                                                <img src={v.resource_url} />
                                                <p>{v.title}</p>
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