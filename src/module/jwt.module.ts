import { config } from "../config";
import { sign, verify } from "jsonwebtoken";
import { EncodeRefreshToken, EncodeToken, JwtResult, UserAuthToken } from "./dto.module";

class JwtModule {
    private readonly jwtKey = config.jwtKey;
    private readonly jwtLifeTime = config.jwtLifeTime;
    private readonly jwtRefreshKey = config.jwtRefreshKey;
    private readonly jwtRefreshLifeTime = config.jwtRefreshLifeTime;

    issue = (data: UserAuthToken): JwtResult => {
        const token = sign({ data: { xid: data.xid, email: data.email } }, this.jwtKey, {
            expiresIn: this.jwtLifeTime,
        });

        return {
            token,
            lifeTime: this.jwtLifeTime,
        };
    };

    issueRefresh = (xid: string): JwtResult => {
        const token = sign({ data: { xid } }, this.jwtRefreshKey);

        return {
            token,
            lifeTime: this.jwtRefreshLifeTime,
        };
    };

    issueWithAudience = (data: UserAuthToken, audience: string): JwtResult => {
        const token = sign({ data: { xid: data.xid, email: data.email } }, this.jwtKey, {
            expiresIn: this.jwtLifeTime,
            audience: audience,
        });

        return {
            token,
            lifeTime: this.jwtLifeTime,
        };
    };

    verifyWithAudience = (token: string, audience: string[]): EncodeToken => {
        return verify(token, this.jwtKey, {
            audience: audience,
        }) as EncodeToken;
    };

    verify = (token: string): EncodeToken => {
        return verify(token, this.jwtKey) as EncodeToken;
    };

    verifyRefreshToken = (token: string): EncodeRefreshToken => {
        return verify(token, this.jwtRefreshKey) as EncodeRefreshToken;
    };
}

export const jwtModule = new JwtModule();
