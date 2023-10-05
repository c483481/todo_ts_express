import { randomBytes, randomUUID } from "crypto";

export function secureRandomString(length: number): string {
    const bytes = randomBytes(Math.ceil(length / 2));
    return bytes.toString("hex").slice(0, length);
}

export function createXid(): string {
    return `${randomUUID()}-${secureRandomString(8)}`;
}
