import { monumentService as test, expect } from "../fixtures/monumentService.fixture";
import { ListUserAccountRolesResponse } from "../../../src/integration/monument/domain/models/users/ListUserAccountRolesResponse";
import { validateUserAccountRoleContract } from "../../../src/integration/monument/domain/validators/userAccountRoleValidator";
import { UserFacilityResponse } from '../../../src/integration/monument/domain/models/facilities/UserFacilityResponse';
import { validateFacilityContract } from '../../../src/integration/monument/domain/validators/userFacilityValidator';
import { validateUserAccount } from '../../../src/integration/monument/domain/validators/userAccountValidator';
import { ListUserAccountResponse } from '../../../src/integration/monument/domain/models/users/ListUserAccountResponse';
import { SortDirection } from '../../../src/integration/monument/domain/enums/SortDirection';
import { OrderField } from '../../../src/integration/monument/domain/types/UserAccountFilters';
import { getRandomElement } from '../../utils/random';
import { AccountStatus } from "../../../src/integration/monument/domain/enums/AccountStatus";

test.describe('[ @api @usersAccount @filters ] User account filters', () => {
    let roles: ListUserAccountRolesResponse[];
    let facilities: UserFacilityResponse[];

    test.beforeEach(async ({ adminCookie, monumentUserAccountService, monumentFacilitiesService }) => {
        const rolesResponse = await monumentUserAccountService.getAllAccountRoles(adminCookie);
        roles = await rolesResponse.json();
        roles.forEach(validateUserAccountRoleContract);

        const facilitiesResponse = await monumentFacilitiesService.getAllUserFacilities(adminCookie);
        facilities = await facilitiesResponse.json();
        facilities.forEach(validateFacilityContract);
    });

    test('[ @smoke ] Default user listing scenario (ACTIVE + PENDING_VERIFICATION)', async ({ adminCookie, monumentUserAccountService }) => {
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, {
            status: [AccountStatus.ACTIVE, AccountStatus.PENDING_VERIFICATION],
            limit: 50,
            page: 1,
            orderBy: [
                [OrderField.FirstName, SortDirection.Asc],
                [OrderField.LastName, SortDirection.Asc],
            ],
        });

        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect([AccountStatus.ACTIVE, AccountStatus.PENDING_VERIFICATION]).toContain(acc.accountStatus);
        });

        const names = accounts.map(acc => `${acc.firstName} ${acc.lastName}`);
        const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sortedNames);
    });

    test(' Filter users by roleId only', async ({ adminCookie, monumentUserAccountService }) => {
        const roleId = getRandomElement(roles).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, { roles: [roleId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
        });
    });

    test(' Filter users by facilityId only', async ({ adminCookie, monumentUserAccountService }) => {
        const facilityId = getRandomElement(facilities).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, { facilities: [facilityId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
        });
    });

    test(' Filter users by roleId and facilityId', async ({ adminCookie, monumentUserAccountService }) => {
        const roleId = getRandomElement(roles).id;
        const facilityId = getRandomElement(facilities).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, { roles: [roleId], facilities: [facilityId] });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
        });
    });

    test(' Filter users by roleId, facilityId and status', async ({ adminCookie, monumentUserAccountService }) => {
        const roleId = getRandomElement(roles).id;
        const facilityId = getRandomElement(facilities).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, {
            roles: [roleId],
            facilities: [facilityId],
            status: [AccountStatus.ACTIVE]
        });
        expect(response.status()).toBe(200);

        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
            expect(acc.accountStatus).toBe(AccountStatus.ACTIVE);
        });
    });

    test(' Filter users by roleId and order by email desc', async ({ adminCookie, monumentUserAccountService }) => {
        const roleId = getRandomElement(roles).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, {
            roles: [roleId],
            limit: 50,
            page: 1,
            orderBy: [[OrderField.Email, SortDirection.Desc]],
        });

        expect(response.status()).toBe(200);
        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.rootRole.id).toBe(roleId);
        });

        const emails = accounts.map(acc => acc.email);
        const sortedEmails = [...emails].sort((a, b) => b.localeCompare(a));
        expect(emails).toEqual(sortedEmails);
    });

    test('Filter users by facilityId and order by rootRoleName asc', async ({ adminCookie, monumentUserAccountService }) => {
        const facilityId = getRandomElement(facilities).id;
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, {
            facilities: [facilityId],
            limit: 50,
            page: 1,
            orderBy: [[OrderField.RootRoleName, SortDirection.Asc]],
        });

        expect(response.status()).toBe(200);
        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
        });

        const rolesNames = accounts.map(acc => acc.rootRole.name);
        const sortedRoles = [...rolesNames].sort((a, b) => a.localeCompare(b));
        expect(rolesNames).toEqual(sortedRoles);
    });

    test('Filter users by status PENDING_VERIFICATION and order by lastName desc', async ({ adminCookie, monumentUserAccountService }) => {
        const response = await monumentUserAccountService.getUserAccounts(adminCookie, {
            status: [AccountStatus.PENDING_VERIFICATION],
            limit: 50,
            page: 1,
            orderBy: [[OrderField.LastName, SortDirection.Desc]],
        });

        expect(response.status()).toBe(200);
        const json = await response.json();
        const accounts = json.items as ListUserAccountResponse[];
        expect(Array.isArray(accounts)).toBe(true);

        accounts.forEach(acc => {
            validateUserAccount(acc);
            expect(acc.accountStatus).toBe(AccountStatus.PENDING_VERIFICATION);
        });

        const lastNames = accounts.map(acc => acc.lastName);
        const sortedLastNames = [...lastNames].sort((a, b) =>
            b.toLowerCase().localeCompare(a.toLowerCase())
        );

        expect(
            lastNames.map(name => name.toLowerCase())
        ).toEqual(sortedLastNames.map(name => name.toLowerCase()));
    });
});
