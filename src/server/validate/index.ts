import { AsyncCheckFunction, SyncCheckFunction } from "fastest-validator";
import { errorResponses } from "../../response";

export function validate(fn: AsyncCheckFunction | SyncCheckFunction, data: unknown) {
    const err = fn(data);
    if (err !== true) {
        throw errorResponses.badError(err);
    }
}
