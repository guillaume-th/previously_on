import Link from "next/link";
import Connexion from "./auth/connexion";
import { useAppSelector } from '../hooks';

export default function Header() {
    const token = useAppSelector(state => state.user.accessToken);
    const userData = useAppSelector(state => state.user.data);
   
    return (
        <header>
            <div>Previously On </div>
            {userData
                ? <p>{userData.login}</p>
                : <Connexion/>
            }
            <nav>
                <Link href="/series/listing">Series</Link>
            </nav>
        </header>
    );
}