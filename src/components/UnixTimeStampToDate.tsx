export function UnixTimeStampToDate({ unixTimeStamp }: { unixTimeStamp: string | number }) {
    const convertedUnixTimeStamp = typeof unixTimeStamp === 'string' ? parseInt(unixTimeStamp) : unixTimeStamp;

    const unix_milliseconds = convertedUnixTimeStamp * 1000;
    const date = new Date(unix_milliseconds)
    const formattedDate = date.toLocaleString();

    return <small>{formattedDate}</small>;
}