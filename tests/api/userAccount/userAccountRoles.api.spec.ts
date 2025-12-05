import { monumentService as test, expect } from "../fixtures/monumentService.fixture";
import { ListUserAccountRolesResponse } from "../../../src/integration/monument/domain/models/users/ListUserAccountRolesResponse";
import { validateUserAccountRoleContract } from "../../../src/integration/monument/domain/validators/userAccountRoleValidator";

test.describe('[ @api @userAccount @roles ] User roles listing', () => {
    test('[ @smoke ] All available user roles successfully listed', async ({ adminCookie, monumentUserAccountService }) => {
        const response = await monumentUserAccountService.getAllAccountRoles(adminCookie);
        expect(response.status()).toBe(200);

        const roles = (await response.json()) as ListUserAccountRolesResponse[];
        expect(Array.isArray(roles)).toBe(true);
        expect(roles.length).toBeGreaterThan(0);

        roles.forEach(validateUserAccountRoleContract);
    });
});
