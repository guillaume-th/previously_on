import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../Header";
import { showData, Episode } from "../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showData>();
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const router = useRouter();

    useEffect(() => {
        const id = getId();
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

    const getEpisodes = (id:string) => {
        fetch(`https://api.betaseries.com/shows/episodes?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                let data = [];
                if (res.episodes) {
                    setEpisodes(res.episodes);
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
        return id as string;
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