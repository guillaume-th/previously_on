import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppSelector } from '../hooks';
import { useState } from 'react';
import { ButtonProps } from '../interfaces';

export default function AddButton({ id, isActive }: ButtonProps) {
    const access_token = useAppSelector<string | null>(state => state.user.accessToken);
    const [added, setAdded] = useState<boolean>(isActive);
    const client_id = process.env.NEXT_PUBLIC_API_KEY;
    const add = () => {
        fetch(`https://api.betaseries.com/shows/show?client_id=${client_id}&id=${id}&access_token=${access_token}`,
            {
                method: added ? "POST" : "DELETE",
            }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.show) {
                    setAdded(!added);
                }
            })
            .catch(err => console.log(err));
    };

    return !added
        ? <AddIcon onClick={add} className="button validated" />
        : <RemoveIcon onClick={add} className="button unvalidated" />
}