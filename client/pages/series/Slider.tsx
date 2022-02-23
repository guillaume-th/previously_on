import Slider from "react-slick";
import { Episode, SliderProps } from "../../interfaces";


export default function EpisodeSlider({ data }:SliderProps) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 3
    }

    return (
        <Slider {...settings}>
            {data.map((v: Episode) =>
                <div className="episode-card">
                    <p>{v.title}</p>
                </div>
            )}
        </Slider>

    );
}