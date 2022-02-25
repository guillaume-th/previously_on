import { SliderProps, Episode } from "../../interfaces";
import { useEffect } from "react";
import Link from "next/link";

export default function Dropper({ data, id }: SliderProps) {

    useEffect(() => {
        document.getElementById(id)?.classList.add("dropper-visible");
    }, []);
        

    return (
        <div className="dropper" id={id}>
            {data.map((v: Episode) =>
                <Link href={`/series/episodes/${v.id}`}>
                    <div className={`episode-card ${v.user.seen ? "episode-seen" : ""}`}>
                        <p>{v.title}</p>
                        <p className="txt-sm">{v.code}</p>
                        <img src={v.image} alt="" />
                    </div>
                </Link>
            )}
        </div>
    );
}