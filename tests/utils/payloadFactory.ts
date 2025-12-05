import { faker } from "@faker-js/faker";
import { PaginatedFacilitiesResponse } from "../../src/integration/monument/domain/models/facilities/PaginatedFacilitiesResponse";

export function generateListFacilitiesUserFacilitiesResponse(size: number) {
    return Array.from({ length: size }, () => ({
        description: faker.company.name(),
        id: faker.string.uuid(),
        orgId: faker.string.uuid(),
        facilityName: faker.company.name(),
        location: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
        phone: faker.phone.number({ style: "human" }),
        email: faker.internet.email({ provider: "monument-fake-mail.com" }),
        state: faker.location.state({ abbreviated: true }),
        city: faker.location.city(),
        zip: faker.location.zipCode(),
        organizationUuid: faker.string.uuid(),
        vacantUnits: faker.number.int({ min: 1, max: 100 }),
        timeZone: faker.location.timeZone(),
    }));
}

export function generateListFacilitiesPaginatedResponse(
    itemCount: number = 10,
    totalItems?: number,
    currentPage: number = 1,
    itemsPerPage: number = 100
): PaginatedFacilitiesResponse {
    const total = totalItems ?? itemCount;
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
        meta: {
            totalItems: total,
            itemCount: total,
            itemsPerPage,
            totalPages,
            currentPage,
        },
        items: Array.from({ length: itemCount }, () => ({
            description: faker.company.name(),
            id: faker.string.uuid(),
            orgId: faker.string.uuid(),
            facilityName: faker.company.name(),
            location: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
            phone: faker.phone.number({ style: "human" }),
            email: faker.internet.email({ provider: "monument-fake-mail.com" }),
            state: faker.location.state({ abbreviated: true }),
            city: faker.location.city(),
            zip: faker.location.zipCode(),
            organizationUuid: faker.string.uuid(),
            vacantUnits: faker.number.int({ min: 1, max: 100 }),
            facilityGateIntegrationVendorUuid: null,
            timeZone: faker.location.timeZone(),
            facilityGroups: Array.from(
                { length: faker.number.int({ min: 1, max: 3 }) },
                () => faker.commerce.department()
            ),
        })),
    };
}

export function generateListUserAccountRolesResponse(size: number) {
    return Array.from({ length: size }, () => ({
        id: faker.string.uuid(), name: faker.commerce.productName()
    }));
}

