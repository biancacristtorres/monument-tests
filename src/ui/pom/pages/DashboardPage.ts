import { Page, Locator } from "@playwright/test";
import { NavigationSidebarComponent } from "../components/NavigationSidebarComponent";
import { IAppPageWithSidebar } from "./interfaces/IAppPageWithSidebar";
import { PagePaths } from "../../constants/PagePaths";

export class DashboardPage implements IAppPageWithSidebar {

    readonly path: string = PagePaths.DASHBOARD;
    private readonly page: Page;
    readonly sidebar: NavigationSidebarComponent;

    constructor(page: Page, sidebar: NavigationSidebarComponent) {
        this.page = page;
        this.sidebar = sidebar;
    }

    private get title(): Locator {
        return this.page.locator('#main-container').getByText('Dashboard');
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL(new RegExp(this.path));
        return this.title.isVisible();
    }
}
