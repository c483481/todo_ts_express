import { ObjectId, Schema, SchemaDefinition, model } from "mongoose";
import { BaseAttribute } from "../../../module/dto.module";
import { commonScema } from "./common.model";

export interface LoginHistoryCreationAttribute extends BaseAttribute {
    ip: string;
    userXid: string;
}

export interface LoginHistoryAttribute extends LoginHistoryCreationAttribute {
    _id: ObjectId;
}

const scema: SchemaDefinition<LoginHistoryAttribute> = {
    ip: { type: String, trim: true, required: true, max: 255 },
    userXid: { type: String, trim: true, required: true, max: 255 },
};

Object.assign(scema, commonScema);

const actualScema = new Schema<LoginHistoryAttribute>(scema, { versionKey: false });

export const LoginHistory = model<LoginHistoryAttribute>("loginHistory", actualScema);
