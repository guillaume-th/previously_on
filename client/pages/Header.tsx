import Link from "next/link";
import { updateToken, updateUserData } from '../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect } from 'react';
import Connexion from "./auth/connexion";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function Header() {
    const token = useAppSelector(state => state.user.accessToken);
    const userData = useAppSelector(state => state.user.data);
    const dispatch = useAppDispatch()

    useEffect(() => {
        const tmpToken = localStorage.getItem("token");
        console.log(tmpToken, token);
        if (tmpToken) {
            dispatch(updateToken(tmpToken));
        }
        if (token) {
            getUserData(token);
        }
    }, [])

    function getUserData(token: string) {
        fetch(`https://api.betaseries.com/members/infos?client_id=${API_KEY}&token=${token}`)
            .then(res => res.json())
            .then(res => {
                dispatch(updateUserData(res.member));
            })
            .catch(err => console.log(err));
    }
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