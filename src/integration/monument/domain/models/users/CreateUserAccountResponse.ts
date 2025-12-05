import { AccountStatus } from "../../enums/AccountStatus";

export interface CreateUserAccountResponse {
  id: string;
  accountStatus: AccountStatus;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
}