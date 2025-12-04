import { APIRequestContext, APIResponse } from '@playwright/test';
import { IApiClient } from './IApiClient';


export class PlaywrightApiClient implements IApiClient {
  constructor(private readonly request: APIRequestContext) { }

  async get(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(path, { headers });
  }

  async post(
    path: string,
    data?: object,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.post(path, {
      data,
      headers,
    });
  }

  async put(
    path: string,
    data?: object,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.put(path, {
      data,
      headers,
    });
  }

  async delete(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(path, {
      headers,
    });
  }
}
