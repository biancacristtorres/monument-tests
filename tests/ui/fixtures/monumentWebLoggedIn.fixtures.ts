import { test as base } from '@playwright/test';
import { DashboardPage } from '../../../src/ui/pom/pages/DashboardPage';
import { NavigationSidebarComponent } from '../../../src/ui/pom/components/NavigationSidebarComponent';
import { UserPermissionsPage } from '../../../src/ui/pom/pages/UserPermissionsPage';
import { AddUserModalComponent } from '../../../src/ui/pom/components/AddUserModalComponent';
import { NetworkMockService } from '../../../src/ui/network/NetworkMockService';
import { ToastComponent } from '../../../src/ui/pom/components/ToastComponent';

type AppFixtures = {
  readonly dashboardPage: DashboardPage;
  readonly userPermissionsPage: UserPermissionsPage;
  readonly adminContext: void;
  readonly networkMock: NetworkMockService;
};

export const monumentWebLoggedIn = base.extend<AppFixtures>({
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
  },

  adminContext: [
    async ({ context }, use) => {
      await context.storageState({ path: 'tests/ui/storages/admin.json' });
      await use();
    },
    { auto: true }
  ],

  networkMock: async ({ page }, use) => {
    const networkMock = new NetworkMockService(page);
    await use(networkMock);
    await networkMock.unmockAll();
  },
});

export { expect } from '@playwright/test';
