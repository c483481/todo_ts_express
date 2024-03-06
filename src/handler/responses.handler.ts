import { DEFAULT_FORBIDDEN_ERROR, DEFAULT_INTERNAL_ERROR, DEFAULT_UNAUTHORIZE_ERROR } from "./message.handler";

export interface Responses {
    status: number;
    success: boolean;
    message: string;
    code: string;
    data?: unknown;
}

export interface RequestResponse {
    status: number;
    success: boolean;
    message: string;
}

export class ErrorResponse extends Error {
    private error!: Responses;
    constructor(err: Responses) {
        super(err.code);
        this.error = err;
    }

    getError(): Responses {
        return this.error;
    }
}

export class MapErrorResponse {
    private error: Map<string, ErrorResponse> = new Map();
    private readonly internalError = new ErrorResponse(DEFAULT_INTERNAL_ERROR);
    init(response: Record<string, RequestResponse>) {
        Object.entries(response).map(([key, value]) => {
            this.error.set(key, new ErrorResponse(Object.assign(value, { code: key })));
        });
        // clear response
        response = {};
    }

    getError(str: string): ErrorResponse {
        if (typeof str !== "string") {
            return this.internalError;
        }
        const response = this.error.get(str);

        return response || this.internalError;
    }

    badError(data: unknown): ErrorResponse {
        return new ErrorResponse({
            code: "E_REQ_0",
            status: 400,
            success: false,
            message: "bad request",
            data: data,
        });
    }
}

export const ERROR_UNAUTHORIZE: ErrorResponse = new ErrorResponse(DEFAULT_UNAUTHORIZE_ERROR);

export const ERROR_FORBIDDEN: ErrorResponse = new ErrorResponse(DEFAULT_FORBIDDEN_ERROR);
