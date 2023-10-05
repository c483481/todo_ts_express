export function parseToString(value: unknown, defaultValue?: string): string {
    if (!value) {
        return defaultValue || "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value === "number") {
        return value.toString();
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    if (typeof value === "bigint") {
        return value.toString();
    }

    return defaultValue || "";
}

export function parseToNumber(value: unknown, defaultValue?: number): number {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) ? parsedValue : defaultValue || 0;
}
