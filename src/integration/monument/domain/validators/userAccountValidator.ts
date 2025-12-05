import { AccountStatus } from "../enums/AccountStatus";
import { ListUserAccountResponse } from "../models/users/ListUserAccountResponse";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;
const EMAIL_REGEX = /@/;

export function validateUserAccount(user: ListUserAccountResponse) {
    const stringFields: (keyof ListUserAccountResponse)[] = [
        "id",
        "firstName",
        "lastName",
        "facilityPermissionsFormatted",
    ];

    const nullableStringFields: (keyof ListUserAccountResponse)[] = ["dateLastLogin", "email"];

    for (const field of stringFields) {
        if (typeof user[field] !== "string") {
            throw new Error(
                `Invalid ${field}: expected string, got ${typeof user[field]}`
            );
        }
    }

    for (const field of nullableStringFields) {
        if (user[field] !== null && typeof user[field] !== "string") {
            throw new Error(`Invalid ${field}: expected string or null, got ${typeof user[field]}`);
        }
    }

    if (!Object.values(AccountStatus).includes(user.accountStatus)) {
        throw new Error(
            `Invalid accountStatus: ${user.accountStatus}`
        );
    }

    if (typeof user.rootRole.id !== "string") {
        throw new Error("Invalid rootRole.id: expected string");
    }
    if (typeof user.rootRole.name !== "string") {
        throw new Error("Invalid rootRole.name: expected string");
    }
    if (typeof user.rootRole.description !== "string") {
        throw new Error("Invalid rootRole.description: expected string");
    }
    if (typeof user.rootRole.isAdmin !== "boolean") {
        throw new Error("Invalid rootRole.isAdmin: expected boolean");
    }

    for (const [key, perm] of Object.entries(user.rootRole.permissions)) {
        validatePermission(key, perm);
    }


    if (user.email) {
        if (!EMAIL_REGEX.test(user.email)) {
            throw new Error(`Invalid email format: ${user.email}`);
        }
    }

    if (!UUID_REGEX.test(user.id)) {
        throw new Error(`Invalid UUID format for user id: ${user.id}`);
    }
}

function validatePermission(key: string, perm: any) {
  // Normalize undefined booleans to false
  perm.canEdit = perm.canEdit ?? false;
  perm.canView = perm.canView ?? false;
  perm.canCreate = perm.canCreate ?? false;
  perm.canDelete = perm.canDelete ?? false;

  if (typeof perm.canEdit !== "boolean") {
    throw new Error(`Invalid permission ${key}.canEdit: expected boolean, got ${typeof perm.canEdit}`);
  }
  if (typeof perm.canView !== "boolean") {
    throw new Error(`Invalid permission ${key}.canView: expected boolean, got ${typeof perm.canView}`);
  }
  if (typeof perm.canCreate !== "boolean") {
    throw new Error(`Invalid permission ${key}.canCreate: expected boolean, got ${typeof perm.canCreate}`);
  }
  if (typeof perm.canDelete !== "boolean") {
    throw new Error(`Invalid permission ${key}.canDelete: expected boolean, got ${typeof perm.canDelete}`);
  }
}

