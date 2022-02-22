import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../Header";
import { showData } from "../../interfaces";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showData>();
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
    }, []);


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
                    <div className="display-img" id="display-wrapper" style={{ backgroundImage: `url(${data.images.show})` }}></div>
                    <div className="display-wrapper">
                        {data.id !== undefined &&
                            <div className="series-display" >
                                <h1>{data.title}</h1>
                                <div className=" center horizontal">
                                    <StarOutlineIcon className="block" style={{marginRight : ".5rem"}}/>
                                    <span className="block">{data.notes.mean.toFixed(2)}</span>
                                </div>
                                {/* <img className="series-poster" src={data.images.poster} alt="" /> */}
                                {Object.values(data.genres).map(v =>
                                    <span>{v} </span>
                                )}
                                <p>Total seasons {data.seasons}</p>
                                <p>Total episodes {data.episodes}</p>
                                <p> Resumé : {data.description}</p>
                            </div>
                        }

                    </div>
                </div>

                : <CircularProgress />}
        </div>
    );
}