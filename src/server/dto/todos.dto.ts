import { BaseResult, BaseUpdateAttribute, UserSession } from "../../module/dto.module";

export type TodoResult = BaseResult & {
    title: string;
    userXid: string;
    description: string;
    active: boolean;
};

export type TodoCreation_Payload = {
    title: string;
    description: string;
    userSession: UserSession;
};

export type TodoUpdate_Payload = BaseUpdateAttribute & {
    title: string;
    description: string;
    userSession: UserSession;
};

export type TodoUpdateStatus_Payload = BaseUpdateAttribute & {
    status: boolean;
    userSession: UserSession;
};
