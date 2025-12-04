import { UserAccount, Permission } from "../models/UserAccount";
import { AccountStatus } from "../enums/AccountStatus";

export function validateUserAccount(user: UserAccount) {
    const stringFields: (keyof UserAccount)[] = [
        "id",
        "firstName",
        "lastName",
        "facilityPermissionsFormatted",
    ];

    const nullableStringFields: (keyof UserAccount)[] = ["dateLastLogin", "email"];

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
        if (!user.email.includes("@")) {
            console.error("Invalid email", user.email);
            throw new Error(`Invalid email format: ${user.email}`);
        }
    } else {
        console.warn("email is empty:", user.id);
    }


    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    if (!uuidRegex.test(user.id)) {
        throw new Error(`Invalid UUID format for user id: ${user.id}`);
    }
}
function normalizeBoolean(value: any): boolean {
  if (value === true || value === false) return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
}

function validatePermission(key: string, perm: any) {
  const canEdit = normalizeBoolean(perm.canEdit);
  const canView = normalizeBoolean(perm.canView);
  const canCreate = normalizeBoolean(perm.canCreate);
  const canDelete = normalizeBoolean(perm.canDelete);

  if (typeof canEdit !== "boolean") {
    console.error(`Invalid value for ${key}.canEdit:`, perm.canEdit);
    throw new Error(`Invalid permission ${key}.canEdit: expected boolean`);
  }
  if (typeof canView !== "boolean") {
    console.error(`Invalid value for ${key}.canView:`, perm.canView);
    throw new Error(`Invalid permission ${key}.canView: expected boolean`);
  }
  if (typeof canCreate !== "boolean") {
    console.error(`Invalid value for ${key}.canCreate:`, perm.canCreate);
    throw new Error(`Invalid permission ${key}.canCreate: expected boolean`);
  }
  if (typeof canDelete !== "boolean") {
    console.error(`Invalid value for ${key}.canDelete:`, perm.canDelete);
    throw new Error(`Invalid permission ${key}.canDelete: expected boolean`);
  }
}

