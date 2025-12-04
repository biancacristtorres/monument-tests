export interface UserCredentials {
  username: string;
  password: string;
  acceptTermsAndConditions: boolean;
}

export const testUsers = {
  admin: {
    username: "admin@example.com",
    password: "changeme",
    acceptTermsAndConditions: true
  }
};
