import { ErrorResponse, Responses } from "./responses.handler";

export const DEFAULT_INTERNAL_ERROR: Responses = {
    code: "E_ERR_0",
    status: 500,
    success: false,
    message: "interval server error",
};

export const DEFAULT_SERVER_BUSSY = {
    success: false,
    code: "E_BUSSY_0",
    message: "server bussy, please try again",
};

export const DEFAULT_FORBIDDEN_ERROR: Responses = {
    success: false,
    status: 403,
    code: "E_AUTH",
    message: "Forbidden",
};

export const DEFAULT_UNAUTHORIZE_ERROR: Responses = {
    success: false,
    status: 401,
    code: "E_AUTH",
    message: "Unauthorize",
};

export const ERROR_UNAUTHORIZE: ErrorResponse = new ErrorResponse(DEFAULT_UNAUTHORIZE_ERROR);

export const ERROR_FORBIDDEN: ErrorResponse = new ErrorResponse(DEFAULT_FORBIDDEN_ERROR);