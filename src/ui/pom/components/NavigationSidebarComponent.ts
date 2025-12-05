import { Locator, Page } from "@playwright/test";

export class NavigationSidebarComponent {
  readonly page: Page;
  readonly settings: Locator;
  readonly usersAndPermissions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settings = page.getByRole('link', { name: 'Settings' });
    this.usersAndPermissions = page.getByRole('link', { name: 'Users & Permissions' });
  }

  async goToSettings() {
    await this.settings.click();
  }

  async goToUsersAndPermissions() {
    await this.usersAndPermissions.click();
  }

  async expectVisible() {
    await Promise.all([
      this.settings.waitFor(),
      this.usersAndPermissions.waitFor(),
    ]);
  }
}
