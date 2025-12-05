import { PagePaths } from "../../constants/PagePaths";
import { AddUserModalComponent } from "../components/AddUserModalComponent";
import { NavigationSidebarComponent } from "../components/NavigationSidebarComponent";
import { ToastComponent } from "../components/ToastComponent";
import { IAppPageWithSidebar } from "./interfaces/IAppPageWithSidebar";
import { Locator, Page } from "@playwright/test";

export class UserPermissionsPage implements IAppPageWithSidebar {
    readonly sidebar: NavigationSidebarComponent;
    readonly path: string = PagePaths.USER_PERMISSIONS;
    private readonly page: Page;
    readonly addUserModal: AddUserModalComponent;
    readonly toastComponent: ToastComponent

    constructor(page: Page, sidebar: NavigationSidebarComponent, addUserModal: AddUserModalComponent, toastComponent: ToastComponent) {
        this.page = page;
        this.sidebar = sidebar;
        this.addUserModal = addUserModal;
        this.toastComponent = toastComponent;
    }

    async goto(): Promise<void> {
        await this.page.goto(this.path);
    }

    private get addUserBtn(): Locator {
        return this.page.getByRole('button', { name: 'Add User' });
    }

    private get title(): Locator {
        return this.page.locator('#main-container').getByText('Users & Permissions');
    }


    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL(new RegExp(this.path));
        return this.title.isVisible();
    }

    async clickAddUserButton(): Promise<void> {
        await this.addUserBtn.click();
    }

}