import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function SeriesListing() {
    const [data, setData] = useState<Object[] | null>(null);

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/list?order=popularity`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setData(res)
            })
            .catch(err => console.log(err));
    }, []);

    if (data) {
        return (
            data.map((elt) => {
                return (
                    <div></div>
                )
            })
        );
    }
    else {
        return (
            <CircularProgress />
        );
    }

}