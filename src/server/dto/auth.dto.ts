import { Token } from "../../module/dto.module";
import { UsersResult } from "./users.dto";

export type AuthLogin_Payload = {
    email: string;
    password: string;
    ip: string;
};

export type AuthResult = UsersResult & {
    accessToken: Token;
    refreshToken: Token;
};

export type AuthRegister_Payload = {
    email: string;
    username: string;
    password: string;
    rePassword: string;
};
