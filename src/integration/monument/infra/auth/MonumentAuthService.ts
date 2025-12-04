import { IApiClient } from '../../../../infra/http/IApiClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../constants/MonumentEndpoints';
import { HttpHeaders } from '../../../../constants/http/httpHeaders'

export class MonumentAuthService {
  constructor(private readonly client: IApiClient) { }

login(username: string, password: string, acceptTermsAndConditions: boolean): Promise<APIResponse> {
  return this.client.post(MonumentEndpoints.AUTH.LOGIN, {
    username,
    password,
    acceptTermsAndConditions, 
  });
}

  me(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.AUTH.ME, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

}
