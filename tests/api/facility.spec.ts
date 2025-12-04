import { FacilitiesUserFacilities } from '../../src/integration/monument/domain/models/FacilitiesUserFacilities';
import { validateFacilityContract } from '../../src/integration/monument/domain/validators/FacilitiesUserFacilitiesValidator';
import { monumentService as test, expect } from '../fixtures/MonumentService.fixture';


test('[ @api ] All available user roles successfully listed', async ({ adminCookie, monumentFacilitiesFixtures }) => {
    const response = await monumentFacilitiesFixtures.getAllUserFacilities(adminCookie);
    expect(response.status()).toBe(200);

    const roles = (await response.json()) as FacilitiesUserFacilities[];
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);

    roles.forEach(validateFacilityContract);

    console.log(JSON.stringify(roles, null, 2));

});