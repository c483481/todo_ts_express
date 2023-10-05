import { baseValidator } from "./base.validator";

export class UsersValidator {
    static UsersUpdateBulk_Payload = baseValidator.compile({
        arr: {
            type: "array",
            items: {
                type: "object",
                props: {
                    xid: { type: "string", max: 255, require: true, empty: false, unique: true },
                    username: { type: "string", empty: false, require: true, max: 255, min: 0 },
                },
                strict: true,
            },
            unique: true,
        },
        $$strict: true,
    });

    static UsersInsertBulk_Payload = baseValidator.compile({
        arr: {
            type: "array",
            items: {
                type: "object",
                props: {
                    email: { type: "email", empty: false, require: true, max: 255, min: 0 },
                    username: { type: "string", empty: false, require: true, max: 255, min: 0 },
                    password: { type: "string", empty: false, require: true, min: 0 },
                },
                strict: true,
            },
            unique: true,
        },
        $$strict: true,
    });
}
