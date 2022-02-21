import { useEffect } from "react";
import { AuthData } from "../../interfaces";
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_API_KEY;
const API_SECRET: string | undefined = process.env.NEXT_PUBLIC_API_SECRET;
const redirect_uri: string | undefined = process.env.NEXT_PUBLIC_CALLBACK_URI;

export default function Test() {

    useEffect(() => {
        getAccessToken();
    }, []);

    const getAccessToken = () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const data = {
            client_id: API_KEY,
            client_secret: API_SECRET,
            redirect_uri,
            code
        }
        console.log(data);
        fetch(`https://api.betaseries.com/oauth/access_token`,
            {
                method: "POST",
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err));
    }

    return (
        <p>Test</p>
    );
}