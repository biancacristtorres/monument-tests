import { APIResponse } from '@playwright/test';

export class AuthSessionCookieHandler {

  async getValidSessionCookie(authLoginResponse: APIResponse): Promise<string> {
    if (!authLoginResponse.ok()) {
      throw new Error(`Login failed. Status: ${authLoginResponse.status()}`);
    }

    const setCookieHeaders = authLoginResponse
      .headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value);

    const connectSid = setCookieHeaders
      .map(v => v.split(';')[0].trim())
      .find(c => c.startsWith('connect.sid='));

    if (!connectSid) {
      throw new Error('Login response does not contain connect.sid cookie.');
    }

    return connectSid;
  }


  getInvalidSessionCookie(): string {
    return 'connect.sid=invalid-session-id';
  }
}