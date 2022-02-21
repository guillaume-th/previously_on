import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../Header";
import { showsData } from "../../interfaces";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showsData[]>([]);

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/list?order=popularity&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.shows) {
                    setData(res.shows)
                }
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <Header />
            {data.length > 0
                ? <div className="series-wrapper">
                    {data.length > 0 &&
                        data.map(v => (
                            <div className="series-card" style={{backgroundImage : `${v.images.poster}` }}>
                                <img className="series-poster" src={v.images.poster} alt="" />
                            </div>
                        ))}

                </div>
                : <CircularProgress />}
        </div>
    );
}