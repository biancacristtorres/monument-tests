import { Page, Locator } from "@playwright/test";
import { IAppPage } from "./IAppPage";

export class DashboardPage implements IAppPage {

    readonly path = '/dashboard';
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get title(): Locator {
        return this.page.locator('p').filter({ hasText: 'Dashboard' })
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL(new RegExp(this.path));
        return this.title.isVisible();
    }
}
