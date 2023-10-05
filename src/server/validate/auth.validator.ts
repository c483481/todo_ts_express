import { baseValidator } from "./base.validator";

export class AuthValidator {
    static AuthLogin_Payload = baseValidator.compile({
        email: "email|empty:false|required|max:255",
        password: "string|empty:false|required|min:5",
        $$strict: true,
    });

    static AuthRegister_Payload = baseValidator.compile({
        username: "string|empty:false|required|max:255",
        email: "email|empty:false|required|max:255",
        password: "string|empty:false|required|min:5",
        rePassword: "string|empty:false|required|min:5",
        $$strict: true,
    });
}
