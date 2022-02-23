import { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import {useAppDispatch} from "../../hooks";
import { updateToken } from "../../slices/userSlice"; 
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;
const API_SECRET: string | undefined = process.env.NEXT_PUBLIC_API_SECRET;
const redirect_uri: string | undefined = process.env.NEXT_PUBLIC_CALLBACK_URI;


export default function AuthConfirm() {
    const dispatch = useAppDispatch(); 

    useEffect(() => {
        getAccessToken();
    }, []);

    const getAccessToken = () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        fetch(`https://api.betaseries.com/oauth/access_token?client_id=${API_KEY}&client_secret=${API_SECRET}&redirect_uri=${redirect_uri}&code=${code}`,
            {
                method: "POST",
            })
            .then(res => res.json())
            .then(res => {
                console.log(res.access_token)
                if (res.access_token) {
                    localStorage.setItem("token", res.access_token);
                    dispatch(updateToken(res.access_token));
                    window.location.replace("http://localhost:3000/series/listing");
                }
            })
            .catch(err => console.log(err));
    }

    return null; 
}