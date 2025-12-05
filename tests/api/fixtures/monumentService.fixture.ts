import { test as base, request } from "@playwright/test";
import type { IHttpClient } from "../../../src/integration/infra/http/IHttpClient";
import { PlaywrightHttpClient } from "../../../src/integration/infra/http/PlaywrightHttpClient";
import { ENV } from "../../../src/config/Env";
import { MonumentUserAccountService } from "../../../src/integration/monument/application/services/userAccount/MonumentUserAccountService";
import { MonumentFacilitiesService } from "../../../src/integration/monument/application/services/facilities/MonumentFacilitiesService";
import { MonumentAuthService } from "../../../src/integration/monument/application/services/auth/MonumentAuthService";
import { AuthSessionCookieHandler } from "../../../src/integration/monument/application/services/auth/AuthSessionIdWrapper";

type MonumentServiceFixtures = {
    apiClient: IHttpClient;
    monumentAuthService: MonumentAuthService;
    authSessionCookieHandler: AuthSessionCookieHandler;
    monumentUserAccountService: MonumentUserAccountService;
    monumentFacilitiesService: MonumentFacilitiesService;
};

export const monumentService = base.extend<MonumentServiceFixtures & { adminCookie: string; invalidCookie: string; }>({

    apiClient: async ({ }, use) => {
        const apiRequest = await request.newContext({
            baseURL: ENV.MONUMENT_API_BASE_URL,
        });

        const client = new PlaywrightHttpClient(apiRequest);

        await use(client);
        await apiRequest.dispose();
    },

    monumentAuthService: async ({ apiClient }, use) => {
        await use(new MonumentAuthService(apiClient));
    },

    authSessionCookieHandler: async ({ }, use) => {
        await use(new AuthSessionCookieHandler());
    },

    monumentUserAccountService: async ({ apiClient }, use) => {
        await use(new MonumentUserAccountService(apiClient));
    },

    monumentFacilitiesService: async ({ apiClient }, use) => {
        await use(new MonumentFacilitiesService(apiClient));
    },

    adminCookie: async ({ monumentAuthService, authSessionCookieHandler }, use) => {
        const loginResponse = await monumentAuthService.login(
            ENV.MONUMENT_ADMIN_USER,
            ENV.MONUMENT_ADMIN_PASSWORD,
            ENV.MONUMENT_ADMIN_ACCEPT_TERMS
        );
        const cookie = await authSessionCookieHandler.getValidSessionCookie(loginResponse);
        await use(cookie);
    },

    invalidCookie: async ({ authSessionCookieHandler }, use) => {
        const cookie = authSessionCookieHandler.getInvalidSessionCookie();
        await use(cookie);
    },

});

export { expect } from "@playwright/test";
