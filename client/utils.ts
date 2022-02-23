export function getQueryParameter(path:string):string {
    const slashIndex: number | undefined = path.lastIndexOf("/");
    const id = path.slice(slashIndex + 1, path.length);
    return id as string;
}