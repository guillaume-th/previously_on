import Link from "next/link";
import Connexion from "../pages/auth/connexion";
import { useAppSelector } from '../hooks';
import SearchBar from "./SearchBar";

export default function Header() {
    const token = useAppSelector(state => state.user.accessToken);
    const userData = useAppSelector(state => state.user.data);
   
    return (
        <header>
            <div>Previously On </div>
            <SearchBar/>
            <nav>
                <Link href="/series/listing">Series</Link>
                {userData
                ? <Link href={`/profile/${token}`}>{userData.login}</Link>
                : <Connexion/>
            }
            </nav>
        </header>
    );
}