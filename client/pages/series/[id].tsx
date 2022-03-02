import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../src/Header";
import { showData, Episode } from "../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { getQueryParameter } from "../../utils";
import Dropper from "./Dropper";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { useAppSelector } from "../../hooks";
import ArchiveButton from "../../src/ArchiveButton";
import FavoriteButton from "../../src/FavoriteButton";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

export default function SeriesListing() {
    const [data, setData] = useState<showData>();
    const [episodes, setEpisodes] = useState<Episode[][]>([])
    const [openDroppers, setOpenDroppers] = useState<number[]>([]);
    const token = useAppSelector(state => state.user.accessToken)
    const [added, setAdded] = useState<boolean>(false);

    useEffect(() => {
        const id = getQueryParameter(window.location.pathname);
        const realToken = token ? token : localStorage.getItem("token");
        fetch(`https://api.betaseries.com/shows/display?id=${id}&client_id=${API_KEY}&access_token=${realToken}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.show) {
                    setData(res.show)
                    setAdded(isInAccount(res.show));
                    console.log(res.show)

                }
            })
            .catch(err => console.log(err));

        getEpisodes(id);
    }, []);

    const getEpisodes = (id: string) => {
        fetch(`https://api.betaseries.com/shows/episodes?id=${id}&client_id=${API_KEY}&access_token=${token}`)
            .then(res => res.json())
            .then(res => {

                if (res.episodes) {
                    getThumbnails(res.episodes)
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


    const toggleDropper = (id: number) => {
        if (openDroppers.includes(id)) {
            const i = openDroppers.indexOf(id);
            const tmpData = [...openDroppers];
            tmpData.splice(i, 1);
            setOpenDroppers(tmpData);
        }
        else {
            setOpenDroppers([id, ...openDroppers]);
        }
    }

    const getThumbnails = (episodes: Episode[]) => {
        const fetches = []
        for (let i = 0; i < episodes.length; i++) {
            fetches.push(fetch(`https://api.betaseries.com/pictures/episodes?client_id=${API_KEY}&id=${episodes[i].id}`)
                .then(res => {
                    episodes[i].image = res.url;
                })
                .catch(err => console.log(err)));
        }
        Promise.all(fetches).then(() => {
            const data = formatEpisodes(episodes);
            setEpisodes(data);
        });
    }

    const isInAccount = (data: showData) => {
        return data?.user.remaining > 0 || (data?.user.remaining === 0 && data?.user.status === 100);
    }

    const addToAccount = () => {
        fetch(`https://api.betaseries.com/shows/show?client_id=${API_KEY}&id=${data?.id}&access_token=${token}`,
            {
                method: added ? "DELETE" : "POST",
            }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.show) {
                    setAdded(!added);
                }
            })
            .catch(err => console.log(err));
    };



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
                                        <div className=" horizontal">
                                            <StarOutlineIcon className="block" style={{ marginRight: ".5rem" }} />
                                            <span className="block">{data.notes.mean.toFixed(2)}</span>
                                        </div>
                                        {Object.values(data.genres).map(v =>
                                            <span className="lgt-blue">{v} </span>
                                        )}
                                        <p>{`${data.seasons} saison${data.seasons > 1 ? "s" : ""}`} </p>
                                        <p>{`${data.episodes} épisode${data.episodes > 1 ? "s" : ""}`} </p>
                                        <p style={{ marginBottom: "2rem" }}>{`Durée moyenne : ${data.length} min`} </p>
                                        <div className="horizontal" style={{ gap: "1rem", marginBottom: "1rem" }}>
                                            {!added
                                                ? <AddIcon onClick={addToAccount} className="button validated" />
                                                : <RemoveIcon onClick={addToAccount} className="button unvalidated" />
                                            }
                                            {added &&
                                                <div className="horizontal" style={{ gap: "1rem", marginBottom: "1rem" }}    >
                                                    <FavoriteButton id={data.id} isActive={data.user.favorited} ></FavoriteButton>
                                                    <ArchiveButton id={data.id} isActive={data.user.archived}></ArchiveButton>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <p>{data.description}</p>
                                <div>
                                    {data.platforms &&
                                        <p className="mid-title">Où regarder : </p>
                                    }
                                    <div className="vod-container">
                                        {data.platforms &&
                                            data.platforms.svods.map((v, i) =>
                                                <div key={`svod${i}`}>
                                                    <a href={v.link_url} target="_blank">
                                                        <img src={v.logo} className="vod-logo" />
                                                    </a>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="episode-list-container">
                                    {data.user &&
                                        data.user.remaining !== 0 &&
                                        <div>
                                            <p>Il vous reste <strong>{data.user.remaining}</strong> épisode(s) à voir.</p>
                                            <p className="title-mid">Prochain épisode : </p>
                                            <div className="episode-card">
                                                <p>{data.user.next.title}</p>
                                                <p className="txt-sm">{data.user.next.code}</p>
                                                {/* <img src={data.user.next.image} alt="" /> */}
                                            </div>
                                        </div>
                                    }
                                    <p className="mid-title">Episodes </p>
                                    {episodes.length > 0
                                        ? episodes.map((v: Episode[], i: number) =>
                                            <div >
                                                <div className="dropper-title">
                                                    <div className="horizontal sp-b" onClick={() => toggleDropper(i)}>
                                                        <p className="mid-title lgt-blue">Saison {i + 1}</p>
                                                        <ArrowDropDownCircleIcon sx={{ color: "#BFD7ED", fontSize: "2rem", cursor: "pointer" }} />
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