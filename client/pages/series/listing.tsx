import { CircularProgress } from "@mui/material";
import { useEffect, useState, MouseEvent } from "react";
import Header from "../../src/Header";
import { showData } from "../../interfaces";
import Link from "next/link";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;



export default function SeriesListing() {
    const [data, setData] = useState<showData[]>([]);

    useEffect(() => {
        getData();
    }, []);

    const onEnter = (e: MouseEvent) => {
        (e.target as Element).classList.add("fadeIn");
    };

    const onLeave = (e: MouseEvent) => {
        (e.target as Element).classList.remove("fadeIn");
    };

    const getData = () => {
        fetch(`https://api.betaseries.com/shows/list?order=popularity&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                if (res.shows) {
                    setData(res.shows);
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div>
            <Header />
            <div className="wrapper">
                {data.length > 0
                    ? <div className="series-wrapper">
                        {
                            data.map(v => (
                                <Link
                                    href={`/series/${v.id}`}>
                                    <div className="series-card"
                                        key={v.id}
                                        style={{ backgroundImage: `url(${v.images.poster})` }}
                                    >
                                        <div
                                            className="series-card-data"
                                            onMouseEnter={onEnter}
                                            onMouseLeave={onLeave}>
                                            <p className="card-title">{v.title}</p>

                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                    : <CircularProgress />
                }
            </div>
        </div >
    );
}