import { test, expect } from '../fixtures/app.fixtures';
import { users } from "../../src/config/credentials"

test("[ @ui @smoke ] User with valid credentials can log in successfully", async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  expect(loginPage.isLoaded).toBeTruthy();
  await loginPage.enterEmailUsername(users.admin.username);
  await loginPage.enterPassword(users.admin.password);
  await loginPage.chooseSignIn();
  expect(dashboardPage.isLoaded).toBeTruthy();
});

test.only("[ @ui ] Login fails with an invalid password", async ({ loginPage }) => {
  await loginPage.goto();
  expect(loginPage.isLoaded).toBeTruthy();
  await loginPage.enterEmailUsername(users.admin.username);
  await loginPage.enterPassword('s');
  await loginPage.chooseSignIn();
  expect(await loginPage.getToasterMessage()).toEqual('The email address / username or password you entered is incorrect.');

});

