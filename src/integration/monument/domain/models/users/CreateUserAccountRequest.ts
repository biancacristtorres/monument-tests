export interface CreateUserAccountRequest {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  rootRoleId: string;
  hasAllFacilityAccess: boolean;
  facilityOrgIds?: string[];
}
