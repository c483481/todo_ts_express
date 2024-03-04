export interface FindResult<T> {
    rows: T[];
    count: number;
}

export interface ListResult<T> {
    items: T[];
    count: number;
}

export type UserSession = {
    xid: string;
    email: string;
    ip: string;
};

export type List_Payload = {
    skip: number;
    limit: number;
    sortBy: string;
    showAll: boolean;
    filters: Record<string, string>;
    usersSession: UserSession;
};

export type GetDetail_Payload = {
    xid: string;
    usersSession: UserSession;
};

export interface ModifiedBy {
    xid: string;
    email: string;
}

export interface BaseAttribute {
    xid: string;
    updatedAt: Date;
    createdAt: Date;
    modifiedBy: ModifiedBy;
    version: number;
}

export type BaseResult = {
    xid: string;
    updatedAt: number;
    createdAt: number;
    modifiedBy: ModifiedBy;
    version: number;
};

export interface UserAuthToken {
    xid: string;
    email: string;
}

export type EncodeToken = {
    data: UserAuthToken;
};

export type EncodeRefreshToken = {
    data: {
        xid: string;
    };
};

export type JwtResult = {
    token: string;
    lifeTime: number;
};

export type BaseUpdateAttribute = {
    xid: string;
    version: number;
};

export type Token = {
    token: string;
    lifeTime: number;
};
