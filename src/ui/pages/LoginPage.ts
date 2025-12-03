import { Page, Locator } from "@playwright/test";
import { IAppPage } from "./IAppPage";

export class LoginPage implements IAppPage {

    readonly path = '/login';
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get emailUsernameInput(): Locator {
        return this.page.getByTestId('email-input');
    }

    private get passwordInput(): Locator {
        return this.page.getByTestId('password-input');
    }

    private get signInButton(): Locator {
        return this.page.getByRole('button', { name: 'SIGN IN' });
    }
    private get toastNotification(): Locator {
        return this.page.getByRole('alert');
    }

    async goto(): Promise<void> {
        await this.page.goto(this.path);
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL(new RegExp(this.path));
        return this.emailUsernameInput.isVisible();
    }

    async enterEmailUsername(emailUserName: string) {
        await this.emailUsernameInput.fill(emailUserName);
    }
    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }
    async chooseSignIn() {
        await this.signInButton.click();
    }
    async getToasterMessage(): Promise<string> {
        await this.toastNotification.waitFor();
        const text = await this.toastNotification.textContent();
        return text ?? '';
    }
}
