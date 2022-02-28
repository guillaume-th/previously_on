import { useAppSelector } from "../hooks";


export default function Profile(){
    const userData = useAppSelector(state => state.user.data);
    return (
        <h1>Profile</h1>
    );
}   