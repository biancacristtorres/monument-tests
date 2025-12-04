import dotenv from 'dotenv';

dotenv.config();

type RawEnv = {
    MONUMENT_BASE_URL?: string;
    MONUMENT_API_BASE_URL?: string;
    MONUMENT_ADMIN_USER?: string;
    MONUMENT_ADMIN_PASSWORD?: string;
    MONUMENT_ADMIN_ACCEPT_TERMS?: boolean;
};

type Env = {
    MONUMENT_BASE_URL: string;
    MONUMENT_API_BASE_URL: string;
    MONUMENT_ADMIN_USER: string;
    MONUMENT_ADMIN_PASSWORD: string;
    MONUMENT_ADMIN_ACCEPT_TERMS: boolean;
};

function requireEnvString(raw: RawEnv, key: keyof Env): string {
    const value = raw[key] as string | undefined;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}.`);
    }
    return value;
}

function requireEnvBool(raw: RawEnv, key: keyof Env): boolean {
    const value = raw[key] as boolean | undefined;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}.`);
    }
    return value;
}

const rawEnv: RawEnv = {
    MONUMENT_BASE_URL: process.env.MONUMENT_BASE_URL,
    MONUMENT_API_BASE_URL: process.env.MONUMENT_API_BASE_URL,
    MONUMENT_ADMIN_USER: process.env.MONUMENT_ADMIN_USER,
    MONUMENT_ADMIN_PASSWORD: process.env.MONUMENT_ADMIN_PASSWORD,
    MONUMENT_ADMIN_ACCEPT_TERMS: process.env.MONUMENT_ADMIN_ACCEPT_TERMS
        ? process.env.MONUMENT_ADMIN_ACCEPT_TERMS.toLowerCase() === 'true'
        : undefined,
};

export const ENV: Env = {
    MONUMENT_BASE_URL: requireEnvString(rawEnv, 'MONUMENT_BASE_URL'),
    MONUMENT_API_BASE_URL: requireEnvString(rawEnv, 'MONUMENT_API_BASE_URL'),
    MONUMENT_ADMIN_USER: requireEnvString(rawEnv, 'MONUMENT_ADMIN_USER'),
    MONUMENT_ADMIN_PASSWORD: requireEnvString(rawEnv, 'MONUMENT_ADMIN_PASSWORD'),
    MONUMENT_ADMIN_ACCEPT_TERMS: requireEnvBool(rawEnv, 'MONUMENT_ADMIN_ACCEPT_TERMS'),
};
