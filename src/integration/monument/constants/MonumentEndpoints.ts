export const MonumentEndpoints = {
    AUTH: {
        LOGIN: "/auth/login",
        ME: "/auth/me",
    },
    USER_ACCOUNT: {
            ROLES: "/userAccount/roles",
            BASE: "/userAccount"
        
    },
    FACILITIES: {
        USER: "/facilities/user-facilities",
        PAGINATED_USER: "/facilities/paginated-user-facilities",
    }
} as const;
