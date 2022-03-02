import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ResultData } from "../interfaces";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


export default function SearchBar() {
    const [data, setData] = useState<ResultData[]>([]);

    useEffect(()=>{
        window.addEventListener("keydown", (e:KeyboardEvent)=>{
            console.log(e.key);
            if(e.key === "Escape"){
                setData([]); 
            }
        })
    }, []);

    const search = (e: React.ChangeEvent) => {
        const value = (e.target as HTMLInputElement).value;
        if (value != "" && value.length > 1) {
            fetch(`https://api.betaseries.com/search/shows?client_id=${API_KEY}&text=${value}&limit=10`)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    setData(res.shows);
                })
                .catch(err => console.log(err));
        }
        else {
            setData([]);
        }

    }

    return (
        <div>
            <label htmlFor="search">Cherchez une série</label>
            <div className="search-wrapper">

                <input type="text" id="search" onChange={search} autoComplete="off"
                />
                {data.length > 0 &&
                    <div className="searchSuggestions suggestions">
                        {
                            data.map(v =>
                                <Link href={"/series/" + v.id}>
                                    <div className="suggestion horizontal suggestion-search" style={{gap : "1rem"}}>
                                        <img src={v.poster} className="search-img"/>
                                        <p>{v.title}</p>
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                }
            </div>

        </div>
    );
}