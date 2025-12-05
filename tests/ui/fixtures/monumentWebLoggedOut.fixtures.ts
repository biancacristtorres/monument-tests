import { test as base } from '@playwright/test';
import { LoginPage } from '../../../src/ui/pom/pages/LoginPage';
import { DashboardPage } from '../../../src/ui/pom/pages/DashboardPage';
import { NavigationSidebarComponent } from '../../../src/ui/pom/components/NavigationSidebarComponent';
import { UserPermissionsPage } from '../../../src/ui/pom/pages/UserPermissionsPage';
import { ToastComponent } from '../../../src/ui/pom/components/ToastComponent';
import { AddUserModalComponent } from '../../../src/ui/pom/components/AddUserModalComponent';

type AppFixtures = {
  readonly loginPage: LoginPage;
  readonly dashboardPage: DashboardPage;
  readonly userPermissionsPage: UserPermissionsPage;
};

export const monumentWebLoggedOut = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const toasterComponent = new ToastComponent(page);
    const loginPage = new LoginPage(page, toasterComponent);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const sidebar = new NavigationSidebarComponent(page);
    const dashboardPage = new DashboardPage(page, sidebar);
    await use(dashboardPage);
  },

  userPermissionsPage: async ({ page }, use) => {
    const sidebar = new NavigationSidebarComponent(page);
    const addUserModal = new AddUserModalComponent(page);
    const toasterComponent = new ToastComponent(page);
    const userPermissionsPage = new UserPermissionsPage(page, sidebar, addUserModal, toasterComponent);
    await use(userPermissionsPage);
  }
});

export { expect } from '@playwright/test';
