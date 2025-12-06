import { IHttpClient } from '../../../../infra/http/IHttpClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../../constants/MonumentEndpoints';
import { buildAuthHeaders } from '../utils/headerBuilders';

export class MonumentFacilitiesService {
  constructor(private readonly client: IHttpClient) { }

  getAllUserFacilities(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.FACILITIES.USER, buildAuthHeaders(cookie));
  }

}
