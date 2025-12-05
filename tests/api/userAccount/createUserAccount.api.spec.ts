import { faker } from "@faker-js/faker";
import { monumentService as test, expect } from "../fixtures/monumentService.fixture";
import { ListUserAccountRolesResponse } from "../../../src/integration/monument/domain/models/users/ListUserAccountRolesResponse";
import { UserFacilityResponse } from "../../../src/integration/monument/domain/models/facilities/UserFacilityResponse";
import { validateUserAccountRoleContract } from "../../../src/integration/monument/domain/validators/userAccountRoleValidator";
import { CreateUserAccountRequest } from "../../../src/integration/monument/domain/models/users/CreateUserAccountRequest";
import { getRandomElement } from "../../utils/random";
import { CreateUserAccountResponse } from "../../../src/integration/monument/domain/models/users/CreateUserAccountResponse";
import { validateUserAccountCreated } from "../../../src/integration/monument/domain/validators/userAccountCreatedValidator";
import { AccountStatus } from "../../../src/integration/monument/domain/enums/AccountStatus";
import { validateFacilityContract } from "../../../src/integration/monument/domain/validators/userFacilityValidator";
import { MonumentApiErrorMessages } from "../../../src/integration/monument/constants/messages/MonumentApiErrorMessages";

test.describe('[ @api @usersAccount @create] Create a new user account without facilityOrgIds', () => {
    let roles: ListUserAccountRolesResponse[];

    test.beforeEach(async ({ adminCookie, monumentUserAccountService }) => {
        const rolesResponse = await monumentUserAccountService.getAllAccountRoles(adminCookie);
        roles = await rolesResponse.json();
        roles.forEach(validateUserAccountRoleContract);
    });

    test('[ @smoke ] Create new user with hasAllFacilityAccess true', async ({ adminCookie, monumentUserAccountService }) => {

        const payload: CreateUserAccountRequest = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            jobTitle: faker.person.jobTitle(),
            rootRoleId: getRandomElement(roles).id,
            hasAllFacilityAccess: true,
            email: faker.internet.email()
        };

        const response = await monumentUserAccountService.createUserAccount(adminCookie, payload);

        expect(response.status()).toBe(201);

        const json = await response.json();
        const userAccount = json as CreateUserAccountResponse;

        validateUserAccountCreated(userAccount);
        expect(userAccount.accountStatus).toBe(AccountStatus.PENDING_VERIFICATION);
        expect(userAccount.firstName).toBe(payload.firstName);
        expect(userAccount.lastName).toBe(payload.lastName);
        expect(userAccount.jobTitle).toBe(payload.jobTitle);
        expect(userAccount.email).toBe(payload.email);
    });

    test(' Create new user with hasAllFacilityAccess false', async ({ adminCookie, monumentUserAccountService }) => {

        const payload: CreateUserAccountRequest = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            jobTitle: faker.person.jobTitle(),
            rootRoleId: getRandomElement(roles).id,
            hasAllFacilityAccess: false,
            email: faker.internet.email()
        };

        const response = await monumentUserAccountService.createUserAccount(adminCookie, payload);

        expect(response.status()).toBe(406);

        const json = await response.json();
        expect(json.message).toBe(MonumentApiErrorMessages.FACILITY_PERMISSIONS);
    });
});

test.describe(' Create a new user account with facilityOrgIds', () => {
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

    test(' Create new user with facilityOrgIds and hasAllFacilityAccess false', async ({ adminCookie, monumentUserAccountService }) => {

        const payload: CreateUserAccountRequest = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            jobTitle: faker.person.jobTitle(),
            rootRoleId: getRandomElement(roles).id,
            facilityOrgIds: [getRandomElement(facilities).id],
            hasAllFacilityAccess: false,
            email: faker.internet.email()
        };

        const response = await monumentUserAccountService.createUserAccount(adminCookie, payload);

        expect(response.status()).toBe(201);

        const json = await response.json();
        const userAccount = json as CreateUserAccountResponse;

        validateUserAccountCreated(userAccount);
        expect(userAccount.accountStatus).toBe(AccountStatus.PENDING_VERIFICATION);
        expect(userAccount.firstName).toBe(payload.firstName);
        expect(userAccount.lastName).toBe(payload.lastName);
        expect(userAccount.jobTitle).toBe(payload.jobTitle);
        expect(userAccount.email).toBe(payload.email);
    });

});