import Link from "next/link";

export default function Header(){
    return(
        <header>
            <div>Previously On </div>
            <nav>
                <Link href="/series/listing">Series</Link>
            </nav>
        </header>
    );
}