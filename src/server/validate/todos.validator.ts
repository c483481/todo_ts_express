import { baseValidator } from "./base.validator";

export class TodosValidator {
    static TodosCreation_Payload = baseValidator.compile({
        title: "string|empty:false|required|max:255",
        description: "string|empty:false|required",
        $$strict: true,
    });

    static TodoUpdate_Payload = baseValidator.compile({
        xid: "string|empty:false|required|max:255",
        title: "string|empty:false|required|max:255",
        description: "string|empty:false|required",
        version: "number|empty:false|min:1|required",
        $$strict: true,
    });

    static TodoUpdateStatus_Payload = baseValidator.compile({
        xid: "string|empty:false|required|max:255",
        status: "boolean|empty:false|required",
        version: "number|empty:false|min:1|required",
        $$strict: true,
    });
}
