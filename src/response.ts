import { MapErrorResponse } from "./handler/responses.handler";

export const errorResponses: MapErrorResponse = new MapErrorResponse();

export function initErrorResponse() {
    errorResponses.init({
        E_FOUND_1: {
            status: 404,
            success: false,
            message: "Recource Not Found",
        },
        E_AUTH_1: {
            status: 401,
            success: false,
            message: "Unauthorize",
        },
        E_AUTH_2: {
            status: 400,
            success: false,
            message: "password doesn't match",
        },
        E_AUTH_3: {
            status: 403,
            success: false,
            message: "Forbidden",
        },
        E_AUTH_4: {
            status: 400,
            success: false,
            message: "email already taken",
        },
        E_AUTH_5: {
            status: 429,
            success: false,
            message: "Email Login Attempts Exceeded Error",
        },
        E_REQ_1: {
            status: 400,
            success: false,
            message: "Bad Request",
        },
        E_REQ_2: {
            status: 400,
            success: false,
            message: "invalid version",
        },
        E_REC_1: {
            status: 400,
            success: false,
            message: "Duplicate Recource",
        },
        E_ERR_1: {
            status: 400,
            success: false,
            message: "Failed while update recource",
        },
        E_INV_1: {
            status: 400,
            success: false,
            message: "Invalid pattern",
        },
    });
}
