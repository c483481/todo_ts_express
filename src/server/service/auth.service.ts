import {
    AppRepositoryMap,
    EmailLimitRepository,
    LoginHistoryRepository,
    RefreshTokenRepository,
    UsersRepository,
} from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { compareString } from "../../utils/compare.utils";
import { createData } from "../../utils/helper.utils";
import { jwtModule } from "../../module/jwt.module";
import { secureRandomString } from "../../utils/string.utils";
import { errorResponses } from "../../response";
import { AuthLogin_Payload, AuthRegister_Payload, AuthResult } from "../dto/auth.dto";
import { LoginHistoryCreation_Payload } from "../dto/login-history.dto";
import { UsersResult } from "../dto/users.dto";
import { UsersAttributes, UsersCreationAttributes } from "../model/sql/users.model";
import { BaseService } from "./base.service";
import { composeUsers } from "./users.service";
import { bcryptModule } from "../../module/bcrypt.module";

export class Auth extends BaseService implements AuthService {
    private usersRepo!: UsersRepository;
    private limitEmailRepo!: EmailLimitRepository;
    private loginHistoryRepo!: LoginHistoryRepository;
    private refreshTokenRepo!: RefreshTokenRepository;

    init(repository: AppRepositoryMap): void {
        this.usersRepo = repository.users;
        this.limitEmailRepo = repository.limitEmail;
        this.loginHistoryRepo = repository.loginHistory;
        this.refreshTokenRepo = repository.refreshToken;
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

        const randomToken = secureRandomString(8);

        const lifeTime = await this.refreshTokenRepo.setRefreshToken(randomToken, users.xid);

        const payloadLoginHistory: LoginHistoryCreation_Payload = {
            userXid: users.xid,
            ip: ip,
        };

        this.loginHistoryRepo.triggerPubsub(payloadLoginHistory);

        const token = jwtModule.issue({
            xid: users.xid,
            email: users.email,
        });

        const result = composeUsers(users) as AuthResult;

        result.accessToken = {
            token: token.token,
            lifeTime: token.lifeTime,
        };

        result.refreshToken = {
            token: randomToken,
            lifeTime: lifeTime,
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

    refreshToken = async (token: string | null): Promise<AuthResult> => {
        if (!token) {
            throw errorResponses.getError("E_REF_1");
        }

        const resultRedis = await this.refreshTokenRepo.getRefreshToken(token);
        if (!resultRedis.xid || !resultRedis.lifeTime) {
            throw errorResponses.getError("E_REF_1");
        }

        const users = await this.usersRepo.findByXid(resultRedis.xid);
        if (!users) {
            throw errorResponses.getError("E_REF_1");
        }

        const result = composeUsers(users) as AuthResult;

        result.refreshToken = {
            token,
            lifeTime: resultRedis.lifeTime,
        };

        const accessToken = jwtModule.issue({
            email: users.email,
            xid: users.xid,
        });

        result.accessToken = accessToken;

        return result;
    };
}
