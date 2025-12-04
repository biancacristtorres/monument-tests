import type { UserAccountRoles } from "../models/UserAccountRoles";

export function validateUserAccountRoleContract(role: UserAccountRoles) {
  if (typeof role.id !== "string") {
    throw new Error(`Invalid role.id: expected string, got ${typeof role.id}`);
  }

  if (typeof role.name !== "string") {
    throw new Error(`Invalid role.name: expected string, got ${typeof role.name}`);
  }

  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  if (!uuidRegex.test(role.id)) {
    throw new Error(`Invalid UUID format for userAccount role id: ${role.id}`);
  }
}
