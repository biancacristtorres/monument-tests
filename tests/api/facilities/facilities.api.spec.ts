import { UserFacilityResponse } from '../../../src/integration/monument/domain/models/facilities/UserFacilityResponse';
import { validateFacilityContract } from '../../../src/integration/monument/domain/validators/userFacilityValidator';
import { monumentService as test, expect } from '../fixtures/monumentService.fixture';

test.describe('[ @api @facilities @facilities-sc1 ] User facilities listing', () => {
    test('[ @smoke ] All available user facilities successfully listed', async ({ adminCookie, monumentFacilitiesService }) => {
        const response = await monumentFacilitiesService.getAllUserFacilities(adminCookie);
        expect(response.status()).toBe(200);

        const facilities = (await response.json()) as UserFacilityResponse[];
        expect(Array.isArray(facilities)).toBe(true);
        expect(facilities.length).toBeGreaterThan(0);

        facilities.forEach(validateFacilityContract);
    });
});