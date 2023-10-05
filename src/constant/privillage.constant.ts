export enum Roles {
    SUPER_ADMIN = "1",
    ADMIN = "2",
    PUBLIC = "3",
}

export const Privilege = {
    PUBLIC: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.PUBLIC],
    ADMIN: [Roles.SUPER_ADMIN, Roles.ADMIN],
    SUPER_ADMIN: [Roles.SUPER_ADMIN],
};
