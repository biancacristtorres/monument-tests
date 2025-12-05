import { AccountStatus } from "../enums/AccountStatus";
import { CreateUserAccountResponse } from "../models/users/CreateUserAccountResponse";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;
const EMAIL_REGEX = /@/;

function validateUuid(id: string): void {
    if (!UUID_REGEX.test(id)) {
        throw new Error(`Invalid UUID format: ${id}`);
    }
}

function validateEmail(email: string): void {
    if (!EMAIL_REGEX.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
    }
}

export function validateUserAccountCreated(user: CreateUserAccountResponse): void {
    validateUuid(user.id);

    if (!Object.values(AccountStatus).includes(user.accountStatus)) {
        throw new Error(`Invalid accountStatus: ${user.accountStatus}`);
    }

    const requiredStringFields: Array<keyof CreateUserAccountResponse> = [
        "firstName",
        "lastName",
        "jobTitle",
        "email",
    ];

    for (const field of requiredStringFields) {
        const value = user[field];
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new Error(`Invalid ${String(field)}: expected non-empty string`);
        }
    }

    validateEmail(user.email);
}
