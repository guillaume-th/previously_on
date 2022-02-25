import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../Header";
import { Episode } from "../../../interfaces";
import { getQueryParameter } from "../../../utils";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useAppSelector } from "../../../hooks";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

const defaultEpisode:Episode = {
    title: "",
    season: 0,
    id: 0,
    code: "",
    user: {
        seen: false,
    },
    image: "",
    date: "",
    episode: 0,
    description: "",
    note: {
        mean: 0
    }
}

export default function SeriesListing() {
    const [data, setData] = useState<Episode>(defaultEpisode);
    const [image, setImage] = useState("");
    const [background, setBackGround] = useState<string>("");
    const [episodeId, setEpisodeId] = useState<string>("");
    // const [seen, setSeen] = useState(false);
    const token = useAppSelector(state => state.user.accessToken)

    useEffect(() => {
        const id = getQueryParameter(window.location.pathname);
        console.log(token);
        setEpisodeId(id)
        fetch(`https://api.betaseries.com/episodes/display?id=${id}&client_id=${API_KEY}&access_token=${token}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.episode) {

                    setData(res.episode as Episode)
                    getBackground(res.episode.show.id);
                }
            })
            .catch(err => console.log(err));
        console.log(id)
        getImage(id);

    }, []);

    const getImage = (id: string) => {
        fetch(`https://api.betaseries.com/pictures/episodes?id=${id}&client_id=${API_KEY}`)
            .then(res => {
                if (res.url) {
                    setImage(res.url)
                }
            })
            .catch(err => console.log(err));
    }
    const getBackground = (id: string) => {
        fetch(`https://api.betaseries.com/shows/display?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                if (res.show.images.show) {
                    setBackGround(res.show.images.show)
                }
            })
            .catch(err => console.log(err));
    }
    const addAllToSeen = (id: string) => {
        console.log(id)
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&client_id=${API_KEY}&access_token=${token}`, {
            method: "POST",
        })
            .then(res => {
            })
            .catch(err => console.log(err));
    }

    const addToSeen = (id: string) => {
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`, {
            method: "POST",
        })
            .then(res => {
                if (res.status === 200) {
                    const newData: Episode = { ...data };
                    newData.user.seen = true;
                    setData(newData);
                }
                console.log(res);
            })
            .catch(err => console.log(err));
    }
    const removeFromSeen = (id: string) => {
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`, {
            method: "Delete",
        })
            .then(res => {
                if (res.status === 200) {
                    const newData: Episode = { ...data };
                    newData.user.seen = false;
                    setData(newData);
                }
            })
            .catch(err => console.log(err));
    }

    const Buttons = () => {
        return (
            data?.user.seen
                ? <CheckCircleOutlineIcon className="button" onClick={() => { removeFromSeen(episodeId) }} />
                : <div>
                    <RadioButtonUncheckedIcon className="button" onClick={() => { addToSeen(episodeId) }} />
                    <PlaylistAddCheckCircleIcon className="button" onClick={() => { addAllToSeen(episodeId) }} />
                </div>
        )

    }

    return (
        <div>
            <Header />
            {data.title !== ""
                ? <div>
                    <div className="display-img" id="display-wrapper" style={{ backgroundImage: `url(${background})` }}></div>
                    <div className="display-wrapper">
                        <div className="series-display" >
                            <h1>{data.title}</h1>
                            <p>{data.code}</p>
                            <div className=" center horizontal">
                                <StarOutlineIcon className="block" style={{ marginRight: ".5rem" }} />
                                <span className="block">{data.note.mean.toFixed(1)}</span>
                            </div>
                            <img src={image} alt="" />
                            <p>sortie : {data.date}</p>
                            <p>season n°{data.season}</p>
                            <p>episodes n°{data.episode}</p>
                            <p> Resumé : {data.description}</p>
                            <Buttons />
                        </div>
                    </div>
                </div>
                : <CircularProgress />}
        </div>
    );
}