import { Locator, Page } from "@playwright/test";

export class AddUserModalComponent {

    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    private get addUserModal(): Locator {
        return this.page.locator('span:has-text("Add User")');
    }

    private get firstNameInput(): Locator {
        return this.page.getByTestId('firstName-input');
    }

    private get lastNameInput(): Locator {
        return this.page.getByTestId('lastName-input');
    }

    private get emailInput(): Locator {
        return this.page.getByTestId('email-input');
    }

    private get jobTitleInput(): Locator {
        return this.page.getByTestId('jobTitle-input');
    }

    private get roleDropdown(): Locator {
        return this.page.getByTestId('single-select-rootRoleId');
    }

    private roleOption(name: string): Locator {
        return this.page.getByRole('option', { name });
    }

    private get toggleAccessAllFacilities(): Locator {
        return this.page.getByLabel('Access All Facilities');
    }

    private get toggleAccessAllFacilitiesChecked(): Locator {
        return this.toggleAccessAllFacilities.locator('.MuiSwitch-switchBase');
    }

    private get searchFacilityInput(): Locator {
        return this.page.locator('input[name="facilitySearchString"]');
    }

    private get stateDropdown(): Locator {
        return this.page.getByRole('button', { name: 'State' })
    }

    private get searchStateInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Search State' })
    }

    private get applyButton(): Locator {
        return this.page.getByRole('button', { name: 'Apply' })
    }

    private get addUserButton(): Locator {
        return this.page.getByRole('button', { name: 'Add User' });
    }

    private get errorMessage(): Locator {
        return this.page.locator('[data-testid="ExclamationCircleRegularIcon"]')
            .locator('xpath=following-sibling::p')
            .first();
    }

    private facilityRowByName(name: string): Locator {
        return this.page.getByText(name);
    }

    async isAddUserModalVisible(): Promise<boolean> {
        return this.addUserModal.isVisible();
    }

    async waitForOpen(): Promise<void> {
        await this.addUserModal.waitFor();
    }

    async enterFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    async enterLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async enterJobTitle(jobTitle: string): Promise<void> {
        await this.jobTitleInput.fill(jobTitle);
    }

    async selectRoleByName(roleName: string): Promise<void> {
        await this.roleDropdown.click();
        await this.roleOption(roleName).click();
    }

    async checkToggleAllFacilities(): Promise<void> {
        await this.toggleAccessAllFacilities.click();
        await this.toggleAccessAllFacilitiesChecked.waitFor();
    }

    async clickAddUserButton(): Promise<void> {
        await this.addUserButton.click();
    }

    async checkFacilityByName(name: string) {
        const facility = this.facilityRowByName(name);
        const row = facility.locator('xpath=ancestor::tr');
        const targetCell = row.locator('.MuiTableCell-root.MuiTableCell-body').first();
        await row.waitFor();
        await targetCell.scrollIntoViewIfNeeded();
        await targetCell.click();
    }

    async getErrorMessage(): Promise<string> {
        return (await this.errorMessage.textContent()) || '';
    }
}