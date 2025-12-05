import { Page, Locator, expect } from '@playwright/test';

export class ToastComponent {
    constructor(private page: Page) { }

    private get byRoleToast(): Locator {
        return this.page.getByRole('alert');
    }

    async getText(): Promise<string> {
        return (await this.byRoleToast.textContent()) ?? '';
    }

    async isVisible(): Promise<boolean> {
        if ((await this.byRoleToast.count()) === 0) {
            return false;
        }
        return this.byRoleToast.isVisible();
    }
}