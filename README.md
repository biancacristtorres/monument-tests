# Monument Tests

Automated test suite for the Monument platform, including API and UI tests using Playwright Test.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Patterns and Conventions](#patterns-and-conventions)

## Overview

This project implements a comprehensive automated test suite to validate the functionality of the Monument API and user interface. The architecture follows clean code principles with a clear separation of concerns across layers.

**Main Technologies:**
- [Playwright Test](https://playwright.dev/) - Test framework
- TypeScript - Strongly typed language
- dotenv - Environment variable management

## Architecture

The project architecture is organized into well-defined layers:

### 1. **Configuration Layer** (`src/config/`)

Manages environment variables and global configurations.

- **`Env.ts`** - Validates and exports required environment variables:
  - `MONUMENT_BASE_URL` - Base URL of the web application
  - `MONUMENT_API_BASE_URL` - Base URL of the API
  - `MONUMENT_ADMIN_USER` - Admin credentials
  - `MONUMENT_ADMIN_PASSWORD`
  - `MONUMENT_ADMIN_ACCEPT_TERMS` - Terms acceptance flag

- **`Credentials.ts`** - Authentication configuration for tests

### 2. **Integration Layer** (`src/integration/`)

Implements integration with external Monument API services.

#### 2.1 **Infrastructure** (`src/integration/infra/`)

HTTP communication abstraction layer.

- **`IHttpClient.ts`** - HTTP client contract
- **`PlaywrightHttpClient.ts`** - Implementation using Playwright context API

#### 2.2 **Monument** (`src/integration/monument/`)

Monument API-specific service implementation.

**Domain Models:**

```
domain/
├── enums/
│   ├── AccountStatus.ts        # ACTIVE, PENDING_VERIFICATION, etc.
│   ├── PageLimit.ts            # Pagination constants
│   └── SortDirection.ts        # ASC, DESC
├── models/
│   ├── facilities/
│   │   ├── PaginatedFacilitiesResponse.ts
│   │   └── UserFacilityResponse.ts
│   └── users/
│       ├── CreateUserAccountRequest.ts
│       ├── ListUserAccountResponse.ts
│       ├── ListUserAccountRolesResponse.ts
│       └── ...
├── types/
│   └── UserAccountFilters.ts   # Search filters
└── validators/
    ├── userAccountValidator.ts
    ├── userAccountRoleValidator.ts
    └── userFacilityValidator.ts
```

**Application Services:**

```
application/services/
├── auth/
│   ├── AuthSessionIdWrapper.ts     # Session cookie wrapper
│   └── MonumentAuthService.ts      # Authentication
├── facilities/
│   └── MonumentFacilitiesService.ts # Facility management
├── userAccount/
│   ├── MonumentUserAccountService.ts
│   └── userAccountQueryBuilder.ts  # Query params builder
└── utils/
    └── headerBuilders.ts           # HTTP header builder functions
```

**Constants:**

- `MonumentEndpoints.ts` - API endpoints
- `MonumentApiErrorMessages.ts` - Expected error messages

### 3. **UI Layer** (`src/ui/`)

Implements Page Object Model (POM) pattern for interface tests.

#### 3.1 **Page Object Model** (`src/ui/pom/`)

```
pom/
├── components/
│   ├── AddUserModalComponent.ts       # User creation modal
│   ├── NavigationSidebarComponent.ts  # Navigation sidebar menu
│   └── ToastComponent.ts              # Toast notifications
├── pages/
│   ├── LoginPage.ts                   # Login page
│   ├── DashboardPage.ts               # Main dashboard
│   └── UserPermissionsPage.ts         # User management
└── interfaces/
    ├── IAppPage.ts                    # Base page interface
    └── IAppPageWithSidebar.ts         # Interface for pages with sidebar
```

**POM Pattern:**

Each page/component encapsulates:
- Locator selectors
- Action methods (clicks, fills)
- Wait methods (waitFor)
- Validation methods (expects)

Example:
```typescript
class LoginPage implements IAppPage {
  readonly path = "/login";
  
  constructor(private page: Page) {}
  
  async enterEmail(email: string): Promise<void> {
    await this.page.getByLabel("Email").fill(email);
  }
  
  async submit(): Promise<void> {
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
```

#### 3.2 **Network Mocking** (`src/ui/network/`)

Manages network request interception and mocking in UI tests.

- **`INetworkMock.ts`** - Network mock contract
- **`NetworkMockService.ts`** - Implementation with mock routing

Example usage:
```typescript
await networkMock.mockRoute('/api/users', {
  status: 200,
  body: { items: [] }
});
```

#### 3.3 **Constants and Messages** (`src/ui/constants/`)

- `PagePaths.ts` - Page URLs
- `UiErrorMessages.ts` - UI error messages
- `UiSuccessMessages.ts` - UI success messages

### 4. **Test Layer** (`tests/`)

Organizes tests following the layered architecture.

#### 4.1 **API Tests** (`tests/api/`)

```
api/
├── fixtures/
│   └── monumentService.fixture.ts  # Fixture with API services
├── facilities/
│   └── facilities.api.spec.ts      # Facilities tests
└── userAccount/
    ├── createUserAccount.api.spec.ts
    ├── ListUserAccount.api.spec.ts
    └── userAccountRoles.api.spec.ts
```

**Fixture Pattern:**
```typescript
export const monumentService = test.extend<MonumentServiceFixture>({
  adminCookie: async ({ }, use) => {
    const cookie = await getAdminSessionId();
    await use(cookie);
  },
  monumentUserAccountService: async ({ }, use) => {
    const service = new MonumentUserAccountService(httpClient);
    await use(service);
  },
});
```

#### 4.2 **UI Tests** (`tests/ui/`)

```
ui/
├── fixtures/
│   ├── monumentWebLoggedIn.fixtures.ts   # Pages + mock service
│   └── monumentWebLoggedOut.fixtures.ts  # Pages only
├── loggedIn/
│   └── createUser.ui.spec.ts
├── loggedOut/
│   └── login.ui.spec.ts
└── storages/
    └── admin.json                        # Browser state (cookies, storage)
```

**Authentication Context:**

UI tests use `admin.json` to reuse authentication state:

```typescript
use: {
  storageState: "tests/ui/storages/admin.json",
}
```

Generated in `globalSetup.ts` during setup.

#### 4.3 **Utils** (`tests/utils/`)

- `payloadFactory.ts` - Factory for creating test payloads
- `random.ts` - Random data utilities

### 5. **Global Setup** (`globalSetup.ts`)

Executed once before all tests:

1. Logs in as admin
2. Saves cookies/localStorage to `tests/ui/storages/admin.json`
3. Reused by all logged-in UI tests

## Project Structure

```
monument-tests/
├── src/
│   ├── config/              # Configuration and environment variables
│   ├── integration/         # Integration services (API, HTTP)
│   │   ├── infra/          # HTTP abstraction
│   │   └── monument/       # Monument-specific domain
│   │       ├── application/
│   │       ├── constants/
│   │       └── domain/
│   └── ui/                 # Interface tests (POM)
│       ├── constants/
│       ├── network/        # Network mocking
│       └── pom/            # Page Object Model
├── tests/
│   ├── api/                # API tests
│   ├── ui/                 # UI tests
│   └── utils/              # Shared utilities
├── playwright.config.ts    # Playwright configuration
├── globalSetup.ts          # Global setup (authentication)
├── package.json
├── .env                    # Environment variables
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONUMENT_BASE_URL=https://your-domain.com
MONUMENT_API_BASE_URL=https://api.your-domain.com
MONUMENT_ADMIN_USER=your-user@example.com
MONUMENT_ADMIN_PASSWORD=your-password
MONUMENT_ADMIN_ACCEPT_TERMS=true
```

## Running Tests

### Tests by Project

**Important:** Always specify a project when running tests to ensure proper test isolation and avoid failures.

**UI Tests (logged in):**
```bash
npx playwright test --project=admin-logged-in
```

**UI Tests (logged out):**
```bash
npx playwright test --project=admin-logged-out
```

**API Tests:**
```bash
npx playwright test --project=api
```

### Tests by Tags

Combine project with tags using `--grep`. **Note:** Always specify `--project` to avoid test failures.

**Available tags:**
- `@smoke` - Critical smoke tests
- `@api` - All API tests
- `@ui` - All UI tests
- `@userAccount` - User account related tests
- `@facilities` - Facilities related tests
- `@login` - Login related tests
- `@create` - Creation tests
- `@filters` - Filter tests
- `@roles` - Role tests

**Examples:**

```bash
# API smoke tests
npx playwright test --project=api --grep @smoke

# UI user account tests (logged in)
npx playwright test --project=admin-logged-in --grep @userAccount

# Login tests (logged out)
npx playwright test --project=admin-logged-out --grep @login

# All facilities tests
npx playwright test --project=api --grep @facilities
```

**View HTML Report:**
```bash
npx playwright show-report
```

## Patterns and Conventions

### Naming Conventions

- **Test files:** `*.spec.ts`
  - UI tests: `*.ui.spec.ts`
  - API tests: `*.api.spec.ts`
- **Classes:** PascalCase (e.g., `LoginPage`, `AddUserModalComponent`)
- **Methods/Functions:** camelCase (e.g., `enterEmail()`, `clickSubmit()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

### Test Organization

All tests use `describe` blocks to group related scenarios:

```typescript
test.describe('[ @api @users ] User Account', () => {
  test('should create user with valid data', async ({ monumentService }) => {
    // test
  });
});
```

### Contract Validation

Each API response is validated with a specific validator:

```typescript
const users = await response.json();
users.forEach(validateUserAccount); // Validates structure and types
```

### Boolean Handling

The validator normalizes `undefined` values in booleans to `false`:

```typescript
// API may return undefined in some situations
perm.canEdit = perm.canEdit ?? false;
```

### Reusable Fixtures

Fixtures encapsulate common configurations and are reused across multiple tests:

```typescript
export const monumentService = test.extend<MonumentServiceFixture>({
  adminCookie: async ({ }, use) => { /* ... */ },
  monumentUserAccountService: async ({ }, use) => { /* ... */ },
});
```

## Contributing

When adding new tests:

1. Create the test in the appropriate directory (`tests/api/` or `tests/ui/`)
2. Use POM pattern for UI tests
3. Validate API responses with validators
4. Group tests with `describe` blocks
5. Use fixtures to share configurations

## AI-Assisted Development

> 📝 *This README was also written with AI assistance!* 😊

This project leverages AI assistance to accelerate development and maintain code quality:

### Common AI Use Cases

**Type Definitions and Interfaces:**
- Generating TypeScript interfaces from API responses
- Creating domain models and enums
- Defining request/response contracts

**Constants and Messages:**
- Creating error message constants
- Defining API endpoint paths
- Setting up configuration constants

**Wording and Documentation:**
- Reviewing test descriptions for clarity
- Checking consistency in error messages
- Writing and maintaining this README

**Code Assistance:**
- Recalling Faker.js methods and syntax (e.g., `faker.person.firstName()`, `faker.internet.email()`)
- Help with Playwright locator strategies and element mapping
- Suggesting best practices for POM implementation

**Quality Checks:**
- Validating naming conventions
- Ensuring consistent code patterns
- Reviewing test organization and structure

Using AI as a development partner helps maintain consistency, reduces boilerplate, and allows focus on test logic and architecture.

## Future Improvements

Potential enhancements to improve the test architecture:

### Modular Package Structure

Consider splitting the codebase into independent npm packages:

```
packages/
├── @monument-tests/api-client/      # API services and models
│   ├── services/
│   ├── models/
│   └── validators/
├── @monument-tests/ui-components/   # POM components and pages
│   ├── pages/
│   └── components/
├── @monument-tests/test-utils/      # Shared utilities
│   ├── factories/
│   └── helpers/
└── @monument-tests/tests/           # Test suites
    ├── api/
    └── ui/
```

**Benefits:**
- Better separation of concerns
- Independent versioning for each package
- Reusability across different test projects
- Easier maintenance and testing of individual components
- Clear dependency management
- Potential to publish and share API client with other teams

**Implementation considerations:**
- Define clear interfaces between packages
- Set up proper build pipelines for each package
- Maintain backward compatibility for shared packages


## Known Issue: Duplicate `/userAccount/roles` Fetch

- **Impact:** Extra API calls when editing a user in Users & Permissions; wastes resources and hurts performance.
- **Expected:** `GET /userAccount/roles` should fire only when the Users & Permissions page is accessed.
- **Actual:** The call happens on page load and again when clicking “Edit User”.
- **Steps to Reproduce:**
  1) Log in as admin.
  2) Go to Settings → Users & Permissions → Users.
  3) Open DevTools → Network.
  4) Observe `GET https://api-ext.stg.monument.io/userAccount/roles` on load, and again after clicking “Edit User”.
- **Environment:** stg; UI path: Users & Permissions → Users tab.

## Known Issue: Incorrect `hasAllFacilityAccess` Payload

- **Impact:** Users cannot create new accounts with correct access; selecting all facilities still reports no access.
- **Expected:** When all facilities are selected, payload must be `hasAllFacilityAccess = true` and `facilityOrgIds = []`.
- **Actual:** Payload sends `hasAllFacilityAccess = "false"` and `facilityOrgIds = [all facility IDs]`, causing backend inconsistencies.
- **Steps to Reproduce:**
  1) Go to Users & Permissions → Users tab (admin portal).
  2) Click **Add User** and fill required fields.
  3) Keep "Access All Facilities" toggle off (default), then manually select all facilities.
  4) Click **Add User**.
  5) Inspect network request for `POST /userAccount` and observe incorrect payload.
- **Environment:** stg; UI path: Users & Permissions → Users tab → Add User.
