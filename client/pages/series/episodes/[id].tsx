import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../Header";
import { Episode } from "../../../interfaces";
import { getQueryParameter } from "../../../utils";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useAppSelector } from "../../../hooks";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<Episode>();
    const [image, setImage] = useState("");
    const [background, setBackGround] = useState<string>("");
    const [id_ep, setId_ep] = useState<string>("");
    const [seen, setSeen] = useState(false);
    const token = useAppSelector(state => state.user.accessToken)
    
    useEffect(() => {
        const id = getQueryParameter(window.location.pathname);
        setId_ep(id)
        fetch(`https://api.betaseries.com/episodes/display?id=${id}&client_id=${API_KEY}&access_token=${token}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.episode) {
                    setData(res.episode)
                    getBackground(res.episode.show.id);
                    if(res.episode.user.seen){
                        setSeen(true)
                    }else{
                        setSeen(false)
                    }
                }
            })
            .catch(err => console.log(err));
            console.log(id)
            getImage(id);

    }, [seen]);

    const getImage = (id: string) => {
    fetch(`https://api.betaseries.com/pictures/episodes?id=${id}&client_id=${API_KEY}`)
    .then(res => {
        // console.log(res);
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
            console.log(res);
            if (res.show.images.show) {
                setBackGround(res.show.images.show)

            }
        })
        .catch(err => console.log(err));
        }
        const PostVuAll = (id: string) => {
            const token = localStorage.getItem("token")
            console.log(id)
            fetch(`https://api.betaseries.com/episodes/watched?id=${id}&client_id=${API_KEY}&access_token=${token}`,{
                method: "POST",
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
            }

            const PostVu = (id: string) => {
                const token = localStorage.getItem("token")
                fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`,{
                    method: "POST",
                })
                .then(res => {
                    console.log(res);
                    setSeen(true);
                })
                .catch(err => console.log(err));
                }
            const DeleteVu = (id: string) => {
                const token = localStorage.getItem("token")
                fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`,{
                    method: "Delete",
                })
                .then(res => {
                    console.log(res);
                    setSeen(false);
                })
                .catch(err => console.log(err));
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
                                {seen==false
                                    ?
                                    <div>
                                    <button onClick={() => {PostVu(id_ep)}}>j ai vu cette episode</button>
                                    <button onClick={() => {PostVuAll(id_ep)}}>j ai vu cette episode et ce d'avant</button> 
                                    </div>
                                   
                                    : <button onClick={() => {DeleteVu(id_ep)}}>je n ai pas vu cette episode</button>}
                            </div>
                        }

                    </div>
                </div>

                : <CircularProgress />}
        </div>
    );
}