import { AccountStatus } from "../enums/AccountStatus";

export type Permission = {
    canEdit: boolean;
    canView: boolean;
    canCreate: boolean;
    canDelete: boolean;
};

export type UserAccount = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateLastLogin: string;
    facilityPermissionsFormatted: string;
    accountStatus: AccountStatus;
    rootRole: {
        id: string;
        name: string;
        description: string;
        isAdmin: boolean;
        permissions: Record<string, Permission>;
    };
};
