export const MonumentEndpoints = {
    AUTH: {
        LOGIN: "/auth/login",
        ME: "/auth/me",
    },
    USER: {
        ACCOUNT: {
            ROLES: "/userAccount/roles",
            LIST: "/userAccount"
        }
    },
    FACILITIES: {
        USER: "/facilities/user-facilities"
    }
} as const;
