import { IHttpClient } from '../../../../infra/http/IHttpClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../../constants/MonumentEndpoints';
import { buildAuthHeaders } from '../utils/headerBuilders';


export class MonumentAuthService {
  constructor(private readonly client: IHttpClient) { }

  login(username: string, password: string, acceptTermsAndConditions: boolean): Promise<APIResponse> {
    return this.client.post(MonumentEndpoints.AUTH.LOGIN, {
      username,
      password,
      acceptTermsAndConditions,
    });
  }

  me(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.AUTH.ME, buildAuthHeaders(cookie));
  }

}
