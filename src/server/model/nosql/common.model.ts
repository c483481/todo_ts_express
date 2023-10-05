import { SchemaDefinition } from "mongoose";
import { BaseAttribute } from "../../../module/dto.module";

export const commonScema: SchemaDefinition<BaseAttribute> = {
    xid: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    version: { type: Number, required: true, min: 0 },
    modifiedBy: { type: Object, require: true },
};
