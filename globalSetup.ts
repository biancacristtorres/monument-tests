import { chromium, BrowserContext } from "@playwright/test";
import { users } from "./src/config/Credentials";
import { LoginPage } from "./src/ui/pom/pages/LoginPage";
import { ENV } from "./src/config/Env";
import { PagePaths } from "./src/ui/constants/PagePaths";
import { DashboardPage } from "./src/ui/pom/pages/DashboardPage";
import { NavigationSidebarComponent } from "./src/ui/pom/components/NavigationSidebarComponent";
import { ToastComponent } from "./src/ui/pom/components/ToastComponent";

async function loginAndSave(context: BrowserContext, username: string, password: string, filePath: string) {
    const page = await context.newPage();
    await page.goto(ENV.MONUMENT_BASE_URL + PagePaths.LOGIN);

    const loginPage = new LoginPage(page, new ToastComponent(page));
    await loginPage.isLoaded();

    await loginPage.enterEmailUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.chooseSignIn();

    const dashboardPage = new DashboardPage(page, new NavigationSidebarComponent(page));
    await dashboardPage.isLoaded();

    await context.storageState({ path: filePath });
    console.log(`✓ Login successful for ${username} - saving storage state to ${filePath}`);

    await page.close();
}

async function globalSetup() {
    const browser = await chromium.launch();

    try {
        await Promise.all([
            (async () => {
                const adminContext = await browser.newContext();
                await loginAndSave(adminContext, users.admin.username, users.admin.password, "tests/ui/storages/admin.json");
                await adminContext.close();
            })(),
            // WARNING: Uncomment below to enable multi-user login setup
            // (async () => {
            //     const analystContext = await browser.newContext();
            //     await loginAndSave(analystContext, users.analyst.username, users.analyst.password, "tests/ui/storages/analyst.json");
            //     await analystContext.close();
            // })(),
        ]);
    } finally {
        await browser.close();
    }
}

export default globalSetup;
