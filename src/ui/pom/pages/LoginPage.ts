import { Page, Locator } from "@playwright/test";
import { IAppPage } from "./interfaces/IAppPage";
import { PagePaths } from "../../constants/PagePaths";
import { ToastComponent } from "../components/ToastComponent";

export class LoginPage implements IAppPage {

    readonly path: string = PagePaths.LOGIN;
    private readonly page: Page;
    readonly toastComponent: ToastComponent;

    constructor(page: Page, toastComponent: ToastComponent) {
        this.page = page;
        this.toastComponent = toastComponent
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
}
