import { AccountStatus } from "../../enums/AccountStatus";

export interface Permission {
    canEdit: boolean;
    canView: boolean;
    canCreate: boolean;
    canDelete: boolean;
}

export interface RootRole {
    id: string;
    name: string;
    description: string;
    isAdmin: boolean;
    permissions: Record<string, Permission>;
}

export interface ListUserAccountResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateLastLogin: string;
    facilityPermissionsFormatted: string;
    accountStatus: AccountStatus;
    rootRole: RootRole;
}
