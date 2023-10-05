import { ObjectId, Schema, SchemaDefinition, model } from "mongoose";
import { BaseAttribute } from "../../../module/dto.module";
import { commonScema } from "./common.model";

export interface TodoCreationAttribute extends BaseAttribute {
    title: string;
    description: string;
    userXid: string;
    active: boolean;
}

export interface TodoAttribute extends TodoCreationAttribute {
    _id: ObjectId;
}

const scema: SchemaDefinition<TodoAttribute> = {
    title: { type: String, trim: true, required: true, max: 255 },
    description: { type: String, trim: true, required: true },
    userXid: { type: String, trim: true, required: true },
    active: { type: Boolean, required: true },
};

Object.assign(scema, commonScema);

const actualScema = new Schema<TodoAttribute>(scema, { versionKey: false });

export const Todo = model<TodoAttribute>("Todos", actualScema);
