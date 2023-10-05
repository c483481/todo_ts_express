import { hash, compare } from "bcrypt";
class BcryptModule {
    hash = async (str: string): Promise<string> => {
        return await hash(str, 10);
    };

    compare = async (pass: string, hash: string): Promise<boolean> => {
        return await compare(pass, hash);
    };
}

export const bcryptModule = new BcryptModule();
