import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppSelector } from '../hooks';
import { useState } from 'react';
import { ButtonProps } from '../interfaces';

export default function ArchiveButton({ id, isActive }: ButtonProps) {
    const access_token = useAppSelector<string | null>(state => state.user.accessToken);
    const [favorite, setFavorite] = useState<boolean>(isActive);
    const client_id = process.env.NEXT_PUBLIC_API_KEY;

    const handleFavorite = () => {
        fetch(`https://api.betaseries.com/shows/favorite?client_id=${client_id}&id=${id}&access_token=${access_token}`,
            {
                method: favorite ? "DELETE" : "POST",
            }).then(res => res.json())
            .then(res => {
                if (res.show) {
                    setFavorite(!favorite);
                }
            })
    };

    return favorite
        ? <FavoriteIcon onClick={handleFavorite} className="button validated" />
        : <FavoriteBorderIcon onClick={handleFavorite} className="button unvalidated" />
}