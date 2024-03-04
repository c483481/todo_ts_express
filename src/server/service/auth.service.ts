import {
    AppRepositoryMap,
    EmailLimitRepository,
    LoginHistoryRepository,
    UsersRepository,
} from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { compareString } from "../../utils/compare.utils";
import { createData } from "../../utils/helper.utils";
import { jwtModule } from "../../module/jwt.module";
import { errorResponses } from "../../response";
import { AuthLogin_Payload, AuthRegister_Payload, AuthResult, RefreshTokenResult } from "../dto/auth.dto";
import { LoginHistoryCreation_Payload } from "../dto/login-history.dto";
import { UsersResult } from "../dto/users.dto";
import { UsersAttributes, UsersCreationAttributes } from "../model/sql/users.model";
import { BaseService } from "./base.service";
import { composeUsers } from "./users.service";
import { bcryptModule } from "../../module/bcrypt.module";
import { isValid } from "ulidx";

export class Auth extends BaseService implements AuthService {
    private usersRepo!: UsersRepository;
    private limitEmailRepo!: EmailLimitRepository;
    private loginHistoryRepo!: LoginHistoryRepository;

    init(repository: AppRepositoryMap): void {
        this.usersRepo = repository.users;
        this.limitEmailRepo = repository.limitEmail;
        this.loginHistoryRepo = repository.loginHistory;
    }

    login = async (payload: AuthLogin_Payload): Promise<AuthResult> => {
        const { email, password, ip } = payload;

        const numRequest = await this.limitEmailRepo.getEmailRequest(email);

        if (numRequest >= 5) {
            throw errorResponses.getError("E_AUTH_5");
        }

        const users: UsersAttributes | null = await this.usersRepo.findByEmail(email);

        if (!users) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const verify: boolean = await bcryptModule.compare(password, users.password);

        if (!verify) {
            await this.limitEmailRepo.limitEmailRequest(email);
            throw errorResponses.getError("E_AUTH_2");
        }

        const payloadLoginHistory: LoginHistoryCreation_Payload = {
            userXid: users.xid,
            ip: ip,
        };

        this.loginHistoryRepo.triggerPubsub(payloadLoginHistory);

        const token = jwtModule.issue({
            xid: users.xid,
            email: users.email,
        });

        const refreshToken = jwtModule.issueRefresh(users.xid);

        const result = composeUsers(users) as AuthResult;

        result.accessToken = {
            token: token.token,
            lifeTime: token.lifeTime,
        };

        result.refreshToken = {
            token: refreshToken.token,
            lifeTime: refreshToken.lifeTime,
        };

        return result;
    };

    register = async (payload: AuthRegister_Payload): Promise<UsersResult> => {
        const { username, email, password, rePassword } = payload;

        const users: UsersAttributes | null = await this.usersRepo.findByEmail(email);

        if (users) {
            throw errorResponses.getError("E_AUTH_4");
        }

        if (!compareString(password, rePassword)) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const newPassword: string = await bcryptModule.hash(password);

        const createdValues: UsersCreationAttributes = createData<UsersCreationAttributes>({
            email: email,
            username: username,
            password: newPassword,
        });

        const created: UsersAttributes = await this.usersRepo.insertUsers(createdValues);

        return composeUsers(created);
    };

    refreshToken = async (xid: string): Promise<RefreshTokenResult> => {
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const users = await this.usersRepo.findByXid(xid);

        if (!users) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const result = composeUsers(users) as RefreshTokenResult;

        result.key = {
            accessToken: jwtModule.issue({
                email: users.email,
                xid: users.xid,
            }),
        };

        return result;
    };
}
