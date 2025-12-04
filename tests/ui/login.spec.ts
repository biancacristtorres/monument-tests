import { test, expect } from '../ui/fixtures/ui.fixtures';
import { users } from "../../src/config/credentials";
import { ErrorMessages } from "../../src/constants/messages/ErrorMessages";
import { faker } from '@faker-js/faker';

test("[ @ui @smoke @sc1 ] User with valid credentials can log in successfully", async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  expect(loginPage.isLoaded).toBeTruthy();
  await loginPage.enterEmailUsername(users.admin.username);
  await loginPage.enterPassword(users.admin.password);
  await loginPage.chooseSignIn();
  expect(dashboardPage.isLoaded).toBeTruthy();
});

test("[ @ui @sc2] Login fails with an invalid password", async ({ loginPage }) => {
  await loginPage.goto();
  expect(loginPage.isLoaded).toBeTruthy();
  await loginPage.enterEmailUsername(users.admin.username);
  await loginPage.enterPassword(faker.string.alphanumeric(5));
  await loginPage.chooseSignIn();
  expect(await loginPage.getToasterMessage()).toEqual(ErrorMessages.INVALID_LOGIN);

});

test("[ @ui @sc3] Login fails with an invalid username", async ({ loginPage }) => {
  await loginPage.goto();
  expect(loginPage.isLoaded).toBeTruthy();
  await loginPage.enterEmailUsername(faker.internet.email());
  await loginPage.enterPassword(users.admin.password);
  await loginPage.chooseSignIn();
  expect(await loginPage.getToasterMessage()).toEqual(ErrorMessages.INVALID_LOGIN);

});

