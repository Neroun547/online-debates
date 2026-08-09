export function getSecondsFromTime(time: string) {
    const arr = time.split(":");

    return (Number(arr[0]) * 60 * 60) + Number(arr[1]) * 60;
}

