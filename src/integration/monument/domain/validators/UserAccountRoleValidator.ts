import type { ListUserAccountRolesResponse } from "../models/users/ListUserAccountRolesResponse";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export function validateUserAccountRoleContract(role: ListUserAccountRolesResponse) {
  if (!UUID_REGEX.test(role.id)) {
    throw new Error(`Invalid UUID format for userAccount role id: ${role.id}`);
  }

  if (typeof role.name !== "string" || role.name.trim().length === 0) {
    throw new Error("Invalid role.name: expected non-empty string");
  }
}
