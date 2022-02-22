import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../Header";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/display?id=11&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.show) {
                    setData(res.show)
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <Header />
            {data
                ? <div className="series-wrapper">
                    {data.id !==undefined &&
                            <div className="series-card" style={{backgroundImage : `${data.images.poster}` }}>
                            <h1>{data.title}</h1>
                            <p>{data.notes.mean}</p>
                            <img className="series-poster" src={data.images.poster} alt="" />
                            {Object.values(data.genres).map(v => (
                            <p>{v}</p>
                            ))}
                            <p>Total seasons {data.seasons}</p>
                            <p>Total episodes {data.episodes}</p>
                            <p> Resumé : {data.description}</p>
                            </div>
                            }

                </div>
                : <CircularProgress />}
        </div>
    );
}