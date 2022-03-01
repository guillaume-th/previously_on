import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { useAppSelector } from '../hooks';
import { useState } from 'react';
import { ButtonProps } from '../interfaces';

export default function ArchiveButton({ id, isActive }: ButtonProps) {
    const access_token = useAppSelector<string | null>(state => state.user.accessToken);
    const [archived, setArchived] = useState<boolean>(isActive);
    const client_id = process.env.NEXT_PUBLIC_API_KEY;

    const handleArchive = () => {
        fetch(`https://api.betaseries.com/shows/archive?client_id=${client_id}&id=${id}&access_token=${access_token}`,
            {
                method: archived ? "DELETE" : "POST",
            }).then(res => res.json())
            .then(res => {
                if (res.show) {
                    setArchived(!archived);
                }
            })
    };

    return archived
        ? <div className="horizontal center validated"><ArchiveIcon onClick={handleArchive} className="button" sx={{ marginRight: "1rem" }} /> <span>Série archivée</span></div>
        : <div className="horizontal center unvalidated"><UnarchiveIcon onClick={handleArchive} className="button" sx={{ marginRight: "1rem" }} /> <span>Archiver la série</span></div>
}