import { monumentService as test, expect } from '../fixtures/MonumentService.fixture';
import { UserAccountRoles } from "../../src/integration/monument/domain/models/UserAccountRoles";
import { validateUserAccountRoleContract } from "../../src/integration/monument/domain/validators/userAccountRoleValidator";
import { FacilitiesUserFacilities } from '../../src/integration/monument/domain/models/FacilitiesUserFacilities';
import { validateFacilityContract } from '../../src/integration/monument/domain/validators/FacilitiesUserFacilitiesValidator';
import { validateUserAccount } from '../../src/integration/monument/domain/validators/validateUserAccount';
import { AccountStatus } from '../../src/integration/monument/domain/enums/AccountStatus';
import { UserAccount } from '../../src/integration/monument/domain/models/UserAccount';


test('[ @api ] All available user roles successfully listed', async ({ adminCookie, monumentUserService }) => {
    const response = await monumentUserService.getAllAccountRoles(adminCookie);
    expect(response.status()).toBe(200);

    const roles = (await response.json()) as UserAccountRoles[];
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);

    roles.forEach(validateUserAccountRoleContract);

    console.log(JSON.stringify(roles, null, 2));

});

test.describe('[ @api ] User account filters', () => {
    let roles: UserAccountRoles[];
    let facilities: FacilitiesUserFacilities[];

    test.beforeEach(async ({ adminCookie, monumentUserService, monumentFacilitiesFixtures }) => {
        const rolesResponse = await monumentUserService.getAllAccountRoles(adminCookie);
        roles = await rolesResponse.json();
        roles.forEach(validateUserAccountRoleContract);

        const facilitiesResponse = await monumentFacilitiesFixtures.getAllUserFacilities(adminCookie);
        facilities = await facilitiesResponse.json();
        facilities.forEach(validateFacilityContract);
    });

    test('Filter users by roleId only', async ({ adminCookie, monumentUserService }) => {
        const roleId = roles[0].id;
        const response = await monumentUserService.getUserAccounts(adminCookie, { roleId: [roleId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as UserAccount[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
        });
    });

    test('Filter users by facilityId only', async ({ adminCookie, monumentUserService }) => {
        const facilityId = facilities[0].id;
        const response = await monumentUserService.getUserAccounts(adminCookie, { facilityId: [facilityId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as UserAccount[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
        });
    });

    test('Filter users by roleId and facilityId', async ({ adminCookie, monumentUserService }) => {
        const roleId = roles[0].id;
        const facilityId = facilities[0].id;
        const response = await monumentUserService.getUserAccounts(adminCookie, { roleId: [roleId], facilityId: [facilityId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as UserAccount[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
        });
    });

    test('Filter users by roleId, facilityId and status', async ({ adminCookie, monumentUserService }) => {
        const roleId = roles[0].id;
        const facilityId = facilities[0].id;
        const response = await monumentUserService.getUserAccounts(adminCookie, {
            roleId: [roleId],
            facilityId: [facilityId],
            status: [AccountStatus.ACTIVE]
        });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as UserAccount[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
            expect(acc.accountStatus).toBe(AccountStatus.ACTIVE);
        });
    });
});