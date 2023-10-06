export function UnixTimeStampToDate({ unixTimeStamp }: { unixTimeStamp: string }) {
    const unix_milliseconds = parseInt(unixTimeStamp) * 1000;
    const date = new Date(unix_milliseconds)
    const formattedDate = date.toLocaleString();

    return <small>{formattedDate}</small>;
}