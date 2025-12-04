import { APIResponse } from '@playwright/test';

export interface IApiClient {
  get(path: string, headers?: Record<string, string>): Promise<APIResponse>;
  post(path: string, data?: object, headers?: Record<string, string>): Promise<APIResponse>;
  put(path: string, data?: object, headers?: Record<string, string>): Promise<APIResponse>;
  delete(path: string, headers?: Record<string, string>): Promise<APIResponse>;
}
