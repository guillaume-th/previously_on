import { SliderProps, Episode } from "../../interfaces";
import {useEffect} from "react"; 

export default function Dropper({ data, id }: SliderProps) {

    useEffect(()=>{
        document.getElementById(id).classList.add("dropper-visible"); 
    }, []);

    return (
        <div className="dropper" id={id}>
            {data.map((v: Episode) =>
                <div className="episode-card">
                    <p>{v.title}</p>
                    <p className="txt-sm">{v.code}</p>
                </div>
            )}
        </div>
    );
}