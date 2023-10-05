import { BaseAttribute } from "../../../module/dto.module";

export interface BaseSequelizeAttribute extends BaseAttribute {
    id: number;
}

export type optionalSequelize = "id";
