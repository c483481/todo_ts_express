export function toUnixEpoch(d: Date): number {
    return Math.round(d.getTime() / 1000);
}

export function getEpochOneYearAgo(): number {
    const nowDate = new Date();
    const oneYearAgo = new Date(nowDate);

    const year = oneYearAgo.getFullYear() - 1;
    const month = nowDate.getMonth();
    const day = nowDate.getDate();

    if (month === 1 && day === 29 && !isLeapYear(year)) {
        oneYearAgo.setDate(28);
    }

    oneYearAgo.setFullYear(year);

    return oneYearAgo.getTime();
}

export function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getEpoch30DaysAgo() {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    return toUnixEpoch(today);
}
