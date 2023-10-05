export function compareString(str1: string, str2: string): boolean {
    if (!str1 || !str2 || typeof str1 !== "string" || typeof str2 !== "string") {
        return false;
    }

    if (str1.length !== str2.length) {
        return false;
    }

    for (let i = 0; i < str1.length; i++) {
        if (!(str1.charCodeAt(i) === str2.charCodeAt(i))) {
            return false;
        }
    }

    return true;
}
