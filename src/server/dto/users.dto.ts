import { BaseResult, UserSession } from "../../module/dto.module";

export type UsersResult = BaseResult & {
    email: string;
    username: string;
};

export type UpdateUsers_Payload = {
    xid: string;
    username: string;
};

export type UsersCreation_Payload = {
    username: string;
    email: string;
    password: string;
};

export type UpdateUsersBulk_Payload = {
    arr: UpdateUsers_Payload[];
    userSession: UserSession;
};

export type CreateUsersBulk_Payload = {
    arr: UsersCreation_Payload[];
    userSession: UserSession;
};
