import { faker } from "@faker-js/faker";
import { monumentWebLoggedIn as test, expect } from "../fixtures/monumentWebLoggedIn.fixtures";
import { ListUserAccountRolesResponse } from "../../../src/integration/monument/domain/models/users/ListUserAccountRolesResponse";
import { MonumentEndpoints } from "../../../src/integration/monument/constants/MonumentEndpoints";
import { randomInt } from "node:crypto";
import { generateListFacilitiesPaginatedResponse, generateListFacilitiesUserFacilitiesResponse, generateListUserAccountRolesResponse } from "../../utils/payloadFactory";
import { getRandomElement } from "../../utils/random";
import { PaginatedFacilitiesResponse } from "../../../src/integration/monument/domain/models/facilities/PaginatedFacilitiesResponse";
import { UiSuccessMessages } from "../../../src/ui/constants/messages/UiSuccessMessages";
import { UiErrorMessages } from "../../../src/ui/constants/messages/UiErrorMessages";
import { users } from "../../../src/config/Credentials";

test.use({ storageState: 'tests/ui/storages/admin.json' });

const roles: ListUserAccountRolesResponse[] = generateListUserAccountRolesResponse(randomInt(2, 5));
const numberOfFacilities = randomInt(2, 5);
const facilities: PaginatedFacilitiesResponse = generateListFacilitiesPaginatedResponse(numberOfFacilities);

test.describe('[ @ui @userAccount @create ] User management', () => {
    test.beforeEach(async ({ networkMock }) => {
        await networkMock.unmockAll();
    });

    test('[ @smoke ] Admin can add a new user with specific facility access', async ({ userPermissionsPage, networkMock, page }) => {
        await networkMock.mockRequest(`**${MonumentEndpoints.USER_ACCOUNT.ROLES}`, {
            status: 200,
            body: roles,
        });

        const role = getRandomElement(roles);
        const facility = getRandomElement(facilities.items);

        await userPermissionsPage.goto();
        expect(userPermissionsPage.isLoaded).toBeTruthy();

        await networkMock.mockRequest(`**${MonumentEndpoints.FACILITIES.PAGINATED_USER}**`, {
            status: 200,
            body: facilities,
        });
        await userPermissionsPage.clickAddUserButton();
        await userPermissionsPage.addUserModal.enterFirstName(faker.person.firstName());
        await userPermissionsPage.addUserModal.enterLastName(faker.person.lastName());
        await userPermissionsPage.addUserModal.enterJobTitle(faker.person.jobTitle());
        await userPermissionsPage.addUserModal.selectRoleByName(role.name);
        await userPermissionsPage.addUserModal.checkFacilityByName(facility.facilityName);
        await userPermissionsPage.addUserModal.enterEmail(faker.internet.email());

0
        await networkMock.mockRequestStatusOnly(`**${MonumentEndpoints.USER_ACCOUNT.BASE}`,
            201
        );
        await userPermissionsPage.addUserModal.clickAddUserButton();

        expect(await userPermissionsPage.toastComponent.getText()).toEqual(UiSuccessMessages.USER_ADDED_SUCCESSFULLY);
    });

    test('Admin cannot add a new user with duplicate email', async ({ userPermissionsPage, networkMock, page }) => {

        await networkMock.mockRequest(`**${MonumentEndpoints.USER_ACCOUNT.ROLES}`, {
            status: 200,
            body: roles,
        });

        const role = getRandomElement(roles);
        const facility = getRandomElement(facilities.items);
        const duplicateEmail = 'duplicate@monument-fake-mail.com';

        await userPermissionsPage.goto();
        expect(userPermissionsPage.isLoaded).toBeTruthy();

        await networkMock.mockRequest(`**${MonumentEndpoints.FACILITIES.PAGINATED_USER}**`, {
            status: 200,
            body: facilities,
        });

        await userPermissionsPage.clickAddUserButton();
        await userPermissionsPage.addUserModal.enterFirstName(faker.person.firstName());
        await userPermissionsPage.addUserModal.enterLastName(faker.person.lastName());
        await userPermissionsPage.addUserModal.enterJobTitle(faker.person.jobTitle());
        await userPermissionsPage.addUserModal.selectRoleByName(role.name);
        await userPermissionsPage.addUserModal.checkFacilityByName(facility.facilityName);
        await userPermissionsPage.addUserModal.enterEmail(users.admin.username);

        await networkMock.mockRequestStatusOnly(`**${MonumentEndpoints.USER_ACCOUNT.BASE}`,
            409
        );
        await userPermissionsPage.addUserModal.clickAddUserButton();

        const errorText = await userPermissionsPage.addUserModal.getErrorMessage();
        expect(errorText).toContain(UiErrorMessages.EMAIL_ALREADY_EXISTS);
    });
});
