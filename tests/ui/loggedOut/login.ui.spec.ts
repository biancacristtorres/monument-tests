import { monumentWebLoggedOut as test, expect } from '../fixtures/monumentWebLoggedOut.fixtures';
import { users } from "../../../src/config/Credentials";
import { UiErrorMessages } from '../../../src/ui/constants/messages/UiErrorMessages';
import { faker } from '@faker-js/faker';


test.describe('[ @ui @login ]Successfully and unssuccesffuly login scenarios', () => {
  test("[ @smoke ] User with valid credentials can log in successfully", async ({ context, loginPage, dashboardPage }) => {
    await loginPage.goto();
    expect(loginPage.isLoaded).toBeTruthy();
    await loginPage.enterEmailUsername(users.admin.username);
    await loginPage.enterPassword(users.admin.password);
    await loginPage.chooseSignIn();
    expect(dashboardPage.isLoaded).toBeTruthy();
  });

  test(" Login fails with an invalid password", async ({ loginPage }) => {
    await loginPage.goto();
    expect(loginPage.isLoaded).toBeTruthy();
    await loginPage.enterEmailUsername(users.admin.username);
    await loginPage.enterPassword(faker.string.alphanumeric(5));
    await loginPage.chooseSignIn();
    expect(await loginPage.toastComponent.getText()).toEqual(UiErrorMessages.INVALID_LOGIN);

  });

  test(" Login fails with an invalid username", async ({ loginPage }) => {
    await loginPage.goto();
    expect(loginPage.isLoaded).toBeTruthy();
    await loginPage.enterEmailUsername(faker.internet.email());
    await loginPage.enterPassword(users.admin.password);
    await loginPage.chooseSignIn();
    expect(await loginPage.toastComponent.getText()).toEqual(UiErrorMessages.INVALID_LOGIN);

  });
});
