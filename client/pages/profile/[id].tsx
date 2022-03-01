import Header from "../../src/Header";
import { getQueryParameter } from "../../utils";
import { ChangeEvent, useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { User } from "../../interfaces";
import { useAppSelector } from "../../hooks";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';

export default function Profile() {
    const [userData, setUserData] = useState<User | null>(null);
    const [friends, setFriends] = useState<{ friends: User[], blocked: User[] } | null>(null);
    const [openBlocked, setOpenBlocked] = useState<boolean>(false);
    const [requests, setRequests] = useState<User[] | null>([]);
    // const [shows, setShows] = useState
    const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const myToken = useAppSelector(state => state.user.accessToken);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        const token = getQueryParameter(window.location.pathname);
        getUserData(token);
        getFriends(token);
        getRequests();
        // getShows();
    }, [refresh]);

    function getUserData(token: string) {
        fetch(`https://api.betaseries.com/members/infos?client_id=${API_KEY}&token=${token}`)
            .then(res => res.json())
            .then(res => {
                console.log(res.member)
                setUserData(res.member);
            })
            .catch(err => console.log(err));

    }

    const getFriends = (token: string) => {
        fetch(`https://api.betaseries.com/friends/list?client_id=${API_KEY}&token=${token}`)
            .then(friends => friends.json())
            .then(friends => {
                fetch(`https://api.betaseries.com/friends/list?client_id=${API_KEY}&token=${token}&blocked=true`)
                    .then(blocked => blocked.json())
                    .then(blocked => {
                        const data = {
                            friends: friends.users,
                            blocked: blocked.users,
                        }
                        setFriends(data);
                    })
            })
            .catch(err => console.log(err));
    }

    const findUser = (e: ChangeEvent) => {
        const value = (e.target as HTMLInputElement).value;
        if (value.length > 1) {
            fetch(`https://api.betaseries.com/members/search?client_id=${API_KEY}&login=${value}%`)
                .then(res => res.json())
                .then(res => {
                    setUserSuggestions(res.users);
                })
                .catch(err => console.log(err));
        }
        else {
            setUserSuggestions([]);
        }
    }

    const handleFriend = (id: number, friends: boolean) => {
        fetch(`https://api.betaseries.com/friends/friend?client_id=${API_KEY}&token=${myToken}&id=${id}`, { method: friends ? "DELETE" : "POST" })
            .then(res => res.json())
            .then(res => {
                if (res.errors.length === 0) {
                    console.log(res);
                    setUserSuggestions([]);
                    setRefresh(Math.random());
                }
            })
            .catch(err => console.log(err));
    }

    const handleBlock = (id: number, blocked: boolean) => {
        fetch(`https://api.betaseries.com/friends/block?client_id=${API_KEY}&token=${myToken}&id=${id}`, { method: blocked ? "DELETE" : "POST" })
            .then(res => res.json())
            .then(res => {
                if (res.member) {
                    setRefresh(Math.random());
                }
            })
            .catch(err => console.log(err));
    }

    // const getShows = (token:string) => {
    //     fetch(`https://api.betaseries.com/shows/list?order=popularity&client_id=${API_KEY}&token=${token}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             if (res.shows) {
    //                 setData(res.shows);
    //             }
    //         })
    //         .catch(err => console.log(err));
    // }

    const getRequests = () => {
        fetch(` https://api.betaseries.com/friends/requests?client_id=${API_KEY}&access_token=${myToken}&received=true`)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setRequests(res.users);
            })
            .catch(err => console.log(err));
    }

    const formatTime = (timeInMin: number) => {
        const hours = Math.floor(timeInMin / 60);
        const min = timeInMin - (hours * 60);
        return `${hours} heures et ${min} min`;
    }

    return (
        <div>
            <Header />
            <h1>Profile</h1>
            {userData
                ? <div>
                    <p>{userData.login}</p>
                    <p>{userData.stats.friends} ami(s). </p>
                    <p>Vous avez regardé des séries pendant <span className="lgt-blue">{formatTime(userData.stats.time_on_tv)}</span></p>
                    <h2>Friends</h2>
                    {friends

                        ? <div>
                            {friends.friends.map(v =>
                                <div className="horizontal center">
                                    {v.login}
                                    <PersonRemoveIcon className="button" onClick={() => handleFriend(v.id, true)} />
                                    <BlockIcon className="button" onClick={() => handleBlock(v.id, false)} />
                                </div>
                            )}
                            <p className="button" onClick={() => setOpenBlocked(!openBlocked)}>Voir les amis bloqués({friends.blocked.length})</p>
                            {openBlocked &&
                                <div>
                                    {friends.blocked.map(v => (
                                        <div className="seen">
                                            {v.login}
                                            <BlockIcon className="button" onClick={() => handleBlock(v.id, true)} />
                                        </div>
                                    ))}

                                </div>
                            }</div>

                        : <CircularProgress />
                    }
                    {myToken &&
                        <div>
                            <h2>Ajouter un ami :</h2>
                            <input type="text" name="friend" onChange={findUser} />
                            <div className="suggestions">
                                {userSuggestions.length > 0 &&
                                    userSuggestions.map(v =>
                                        <div className="suggestion horizontal center">
                                            <span style={{ marginRight: "1rem" }}>{v.login}</span>
                                            <PersonAddIcon onClick={() => handleFriend(v.id, false)} />
                                        </div>
                                    )}
                            </div>
                            {requests?.length 
                                ? <div >
                                    <h2>Demandes reçues :   </h2>
                                    {requests.map(v =>
                                        <div key={v.id + "request"}>
                                            {v.login}
                                        </div>
                                    )}
                                </div>
                                :<p>Vous n'avez pas de notifications</p>
                            }
                        </div>
                    }
                </div>
                : <CircularProgress />
            }
        </div>
    );
}   