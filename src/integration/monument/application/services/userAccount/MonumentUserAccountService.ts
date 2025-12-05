import { IHttpClient } from '../../../../infra/http/IHttpClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../../constants/MonumentEndpoints';
import { HttpHeaders } from '../../../../infra/http/constants/HttpHeaders'
import { UserAccountFilters } from '../../../domain/types/UserAccountFilters';
import { CreateUserAccountRequest } from '../../../domain/models/users/CreateUserAccountRequest';
import { buildListUserAccountFiltering } from './userAccountQueryBuilder';

export class MonumentUserAccountService {
  constructor(private readonly client: IHttpClient) { }

  getAllAccountRoles(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.USER_ACCOUNT.ROLES, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

  getUserAccounts(
    cookie: string,
    filters: UserAccountFilters
  ): Promise<APIResponse> {
    const path = buildListUserAccountFiltering(filters);

    return this.client.get(path, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

  createUserAccount(
    cookie: string,
    payload: CreateUserAccountRequest
  ): Promise<APIResponse> {
    return this.client.post(
      MonumentEndpoints.USER_ACCOUNT.BASE,
      payload,
      { [HttpHeaders.COOKIE]: cookie }
    );
  }

}
