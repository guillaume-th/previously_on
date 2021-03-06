import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../../src/Header";
import { CommentsFetchParams, Episode } from "../../../interfaces";
import { getQueryParameter } from "../../../utils";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useAppSelector } from "../../../hooks";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import { Comment } from "../../../interfaces";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;

const defaultEpisode: Episode = {
    title: "",
    season: 0,
    id: 0,
    code: "",
    user: {
        seen: false,
    },
    image: "",
    date: "",
    episode: 0,
    description: "",
    note: {
        mean: 0
    }
}

export default function SeriesListing() {
    const [data, setData] = useState<Episode>(defaultEpisode);
    const [image, setImage] = useState("");
    const [LastCommentId, setLastCommentId] = useState("");
    const [background, setBackGround] = useState<string>("");
    const [episodeId, setEpisodeId] = useState<string>("");
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [openComments, setOpenComments] = useState(false);
    const token = useAppSelector(state => state.user.accessToken)

    useEffect(() => {
        const id = getQueryParameter(window.location.pathname);
        console.log(id);
        setEpisodeId(id)
        fetch(`https://api.betaseries.com/episodes/display?id=${id}&client_id=${API_KEY}&access_token=${token}`)
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                if (res.episode) {
                    setData(res.episode as Episode)
                    getBackground(res.episode.show.id);
                    getComment({ episodeId: id });
                }
            })
            .catch(err => console.log(err));
        getImage(id);

    }, []);

    const getImage = (id: string) => {
        fetch(`https://api.betaseries.com/pictures/episodes?id=${id}&client_id=${API_KEY}`)
            .then(res => {
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
                if (res.show.images.show) {
                    setBackGround(res.show.images.show)
                }
            })
            .catch(err => console.log(err));
    }
    const addAllToSeen = (id: string) => {
        console.log(id)
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&client_id=${API_KEY}&access_token=${token}`, {
            method: "POST",
        })
            .then(res => {
                if (res.status === 200) {
                    const newData: Episode = { ...data };
                    newData.user.seen = true;
                    setData(newData);
                }
            })
            .catch(err => console.log(err));
    }

    const addToSeen = (id: string) => {
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`, {
            method: "POST",
        })
            .then(res => {
                if (res.status === 200) {
                    const newData: Episode = { ...data };
                    newData.user.seen = true;
                    setData(newData);
                }
                // console.log(res);
            })
            .catch(err => console.log(err));
    }
    const removeFromSeen = (id: string) => {
        fetch(`https://api.betaseries.com/episodes/watched?id=${id}&bulk=false&client_id=${API_KEY}&access_token=${token}`, {
            method: "Delete",
        })
            .then(res => {
                if (res.status === 200) {
                    const newData: Episode = { ...data };
                    newData.user.seen = false;
                    setData(newData);
                }
            })
            .catch(err => console.log(err));
    }

    const getComment = ({ episodeId, lastId }: CommentsFetchParams) => {
        const token = localStorage.getItem("token")
        const option_since_id = lastId ? "&since_id=" + lastId : "";
        console.log(episodeId, lastId);
        fetch(`https://api.betaseries.com/comments/comments?id=${episodeId}&type=episode&client_id=${API_KEY}&access_token=${token}&nbpp=10&order=desc${option_since_id}`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setComments(res.comments);
                setLastCommentId(res.comments[9].id);
            })
            .catch(err => console.log(err));
    }
    const NextComment = () => {
        getComment({ episodeId, lastId: LastCommentId });
    }
    const BackComment = () => {
        // setSinceid(null);
        getComment({ episodeId });
    }
    const sendComment = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const value = ((e.target as HTMLCollection)[0] as HTMLTextAreaElement).value;
        if (value !== "" && value !== null) {
            fetch(`https://api.betaseries.com/comments/comment?client_id=${API_KEY}&access_token=${token}&type=episode&id=${episodeId}&text=${value}`,{method:"POST"})
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err));
        } else {
            console.log("message vide")
        }

    }
    const Buttons = () => {
        return (
            data?.user.seen
                ? <CheckCircleOutlineIcon className="button" onClick={() => { removeFromSeen(episodeId) }} />
                : <div>
                    <RadioButtonUncheckedIcon className="button" onClick={() => { addToSeen(episodeId) }} />
                    <PlaylistAddCheckCircleIcon className="button" onClick={() => { addAllToSeen(episodeId) }} />
                </div>
        )

    }

    return (
        <div>
            <Header />
            {data.title !== ""
                ? <div>
                    <div className="display-img" id="display-wrapper" style={{ backgroundImage: `url(${background})` }}></div>
                    <div className="display-wrapper">
                        <div className="series-display" >
                            <h1>{data.title}</h1>
                            <p>{data.code}</p>
                            <div className=" horizontal">
                                <StarOutlineIcon className="block" style={{ marginRight: ".5rem" }} />
                                <span className="block">{data.note.mean.toFixed(1)}</span>
                            </div>
                            <img src={image} alt="" />
                            <p>sortie : {data.date}</p>
                            <p>season n??{data.season}</p>
                            <p>episodes n??{data.episode}</p>
                            <p> Resum?? : {data.description}</p>
                            <Buttons />
                            <div onClick={() => setOpenComments(!openComments)} className="horizontal sp-b" style={{ cursor: "pointer" }}>
                                <p className="mid-title lgt-blue">Comments </p>
                                <ArrowDropDownCircleIcon sx={{ color: "#BFD7ED", fontSize: "2rem", cursor: "pointer" }} />
                            </div>
                            <hr></hr>
                            {openComments &&
                                <div className="comments-wrapper">
                                    {comments?.map((comment: Comment) =>
                                        <div className="comment horizontal">
                                            <div className="comment-img">
                                                <img src={comment.avatar} alt="" />
                                            </div>
                                            <div className="comment-content">
                                                <p className="username-comment">{comment.login}</p>
                                                {comment.user_note &&
                                                    <div className=" horizontal">
                                                        <StarOutlineIcon className="block" style={{ marginRight: ".5rem" }} />
                                                        <span className="block">{comment.user_note}</span>
                                                    </div>
                                                }
                                                <p>{comment.date}</p>
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={BackComment}>Back</button>
                                    <button onClick={NextComment}>Next</button>
                                </div>
                            }
                            <div className="horizontal center">
                                <p className="mid-title lgt-blue">Poster un commentaire</p>
                            </div>
                            <div className="comment-form-wrapper">
                                <form onSubmit={sendComment} className="comment-form">
                                    <textarea name='commentaire'></textarea>
                                    <div className=" horizontal center">
                                        <input type="submit" value="Envoyer" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                : <CircularProgress />}
        </div>
    );
}