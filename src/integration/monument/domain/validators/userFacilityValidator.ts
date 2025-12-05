import { UserFacilityResponse } from "../models/facilities/UserFacilityResponse";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;
const EMAIL_REGEX = /@/;
const ZIP_REGEX = /^\d{5}$/;
const PHONE_REGEX = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export function validateFacilityContract(facility: UserFacilityResponse) {
  const requiredStringFields: (keyof UserFacilityResponse)[] = [
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

  for (const field of requiredStringFields) {
    const value = facility[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Invalid ${String(field)}: expected non-empty string`);
    }
  }

  if (typeof facility.vacantUnits !== "number" || Number.isNaN(facility.vacantUnits)) {
    throw new Error(`Invalid vacantUnits: expected number`);
  }

  if (!UUID_REGEX.test(facility.id)) {
    throw new Error(`Invalid UUID format for facility id: ${facility.id}`);
  }
  if (!UUID_REGEX.test(facility.orgId)) {
    throw new Error(`Invalid UUID format for facility orgId: ${facility.orgId}`);
  }
  if (!UUID_REGEX.test(facility.organizationUuid)) {
    throw new Error(
      `Invalid UUID format for facility organizationUuid: ${facility.organizationUuid}`
    );
  }

  if (!EMAIL_REGEX.test(facility.email)) {
    throw new Error(`Invalid email format: ${facility.email}`);
  }

  if (!ZIP_REGEX.test(facility.zip)) {
    throw new Error(`Invalid zip format: ${facility.zip}`);
  }

  if (!PHONE_REGEX.test(facility.phone)) {
    throw new Error(`Invalid phone format: ${facility.phone}`);
  }
}
