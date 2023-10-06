export function UnixTimeStampToDate({ unixTimeStamp }: { unixTimeStamp: string }) {
    const date = new Date(parseInt(unixTimeStamp));
    const formattedDate = date.toLocaleString();

    return <small>{formattedDate}</small>;
}