import { monumentService as test, expect } from '../fixtures/MonumentService.fixture';

test('[ @api @sc4] /auth/me with an invalid token is rejected', async ({ monumentAuthService, invalidCookie }) => {
    const cookie = await invalidCookie;

    const response = await monumentAuthService.me(cookie);
    expect(response.status()).toBe(401);
});
