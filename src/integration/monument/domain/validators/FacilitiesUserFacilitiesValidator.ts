import { FacilitiesUserFacilities } from "../models/FacilitiesUserFacilities";

export function validateFacilityContract(facility: FacilitiesUserFacilities) {
  
  const stringFields: (keyof FacilitiesUserFacilities)[] = [
    "description",
    "id",
    "orgId",
    "facilityName",
    "location",
    "phone",
    "email",
    "state",
    "city",
    "zip",
    "organizationUuid",
    "timeZone",
  ];

  for (const field of stringFields) {
    if (typeof facility[field] !== "string") {
      throw new Error(
        `Invalid ${field}: expected string, got ${typeof facility[field]}`
      );
    }
  }

  if (typeof facility.vacantUnits !== "number") {
    throw new Error(
      `Invalid vacantUnits: expected number, got ${typeof facility.vacantUnits}`
    );
  }

  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  if (!uuidRegex.test(facility.id)) {
    throw new Error(`Invalid UUID format for facility id: ${facility.id}`);
  }
  if (!uuidRegex.test(facility.orgId)) {
    throw new Error(`Invalid UUID format for facility orgId: ${facility.orgId}`);
  }
  if (!uuidRegex.test(facility.organizationUuid)) {
    throw new Error(
      `Invalid UUID format for facility organizationUuid: ${facility.organizationUuid}`
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(facility.email)) {
    throw new Error(`Invalid email format: ${facility.email}`);
  }

  const zipRegex = /^\d{5}$/;
  if (!zipRegex.test(facility.zip)) {
    throw new Error(`Invalid zip format: ${facility.zip}`);
  }

  const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  if (!phoneRegex.test(facility.phone)) {
    throw new Error(`Invalid phone format: ${facility.phone}`);
  }
}
