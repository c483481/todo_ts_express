import { BaseResult } from "../../module/dto.module";

export interface LoginHistoryResult extends BaseResult {
    ip: string;
}

export type LoginHistoryCreation_Payload = {
    ip: string;
    userXid: string;
};
