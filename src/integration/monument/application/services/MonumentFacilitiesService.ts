import { IApiClient } from '../../../../infra/http/IApiClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../constants/MonumentEndpoints';
import { HttpHeaders } from '../../../../constants/http/httpHeaders'

export class MonumentFacilitiesService {
  constructor(private readonly client: IApiClient) { }

  getAllUserFacilities(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.FACILITIES.USER, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

}
