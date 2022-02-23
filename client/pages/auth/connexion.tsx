const API_KEY: string| undefined  = process.env.NEXT_PUBLIC_API_KEY;
const redirect_uri: string | undefined = process.env.NEXT_PUBLIC_CALLBACK_URI;

export default function Connexion() {

    const handleAuth = () => {
        window.location.replace(`https://www.betaseries.com/authorize?client_id=${API_KEY}&redirect_uri=${redirect_uri}`)
    }
    return (
        <div>
            <button onClick={handleAuth}>Log in with beta series</button>
        </div>
    );
}