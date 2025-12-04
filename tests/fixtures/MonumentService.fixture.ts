import { test as base, request } from "@playwright/test";
import type { IApiClient } from "../../src/infra/http/IApiClient";
import { PlaywrightApiClient } from "../../src/infra/http/PlaywrightApiClient";
import { MonumentAuthService } from "../../src/integration/monument/infra/auth/MonumentAuthService";
import { ENV } from "../../src/config/env";
import { AuthSessionIdWrapper } from "../../src/integration/monument/infra/auth/AuthSessionIdWrapper";
import { MonumentUserService } from "../../src/integration/monument/application/services/MonumentUserService";
import { MonumentFacilitiesService } from "../../src/integration/monument/application/services/MonumentFacilitiesService";

type MonumentServiceFixtures = {
    apiClient: IApiClient;
    monumentAuthService: MonumentAuthService;
    authSessionIdWrapper: AuthSessionIdWrapper;
    monumentUserService: MonumentUserService;
    monumentFacilitiesFixtures: MonumentFacilitiesService;
};

export const monumentService = base.extend<MonumentServiceFixtures & { adminCookie: string; invalidCookie: string; }>({

    apiClient: async ({ }, use) => {
        const apiRequest = await request.newContext({
            baseURL: ENV.MONUMENT_API_BASE_URL,
        });

        const client = new PlaywrightApiClient(apiRequest);

        await use(client);
        await apiRequest.dispose();
    },

    monumentAuthService: async ({ apiClient }, use) => {
        await use(new MonumentAuthService(apiClient));
    },

    authSessionIdWrapper: async ({ }, use) => {
        await use(new AuthSessionIdWrapper());
    },

    monumentUserService: async ({ apiClient }, use) => {
        await use(new MonumentUserService(apiClient));
    },

    monumentFacilitiesFixtures: async ({ apiClient }, use) => {
        await use(new MonumentFacilitiesService(apiClient));
    },

    adminCookie: async ({ monumentAuthService, authSessionIdWrapper }, use) => {
        const loginResponse = await monumentAuthService.login(
            ENV.MONUMENT_ADMIN_USER,
            ENV.MONUMENT_ADMIN_PASSWORD,
            ENV.MONUMENT_ADMIN_ACCEPT_TERMS
        );
        const cookie = await authSessionIdWrapper.getValidSessionCookie(loginResponse);
        await use(cookie);
    },

    invalidCookie: async ({ authSessionIdWrapper }, use) => {
        const cookie = await authSessionIdWrapper.getInvalidSessionCookie();
        await use(cookie);
    },

});

export { expect } from "@playwright/test";
