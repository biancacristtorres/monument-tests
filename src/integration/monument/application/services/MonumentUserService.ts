import { IApiClient } from '../../../../infra/http/IApiClient';
import { APIResponse } from '@playwright/test';
import { MonumentEndpoints } from '../../constants/MonumentEndpoints';
import { HttpHeaders } from '../../../../constants/http/httpHeaders'
import { PageLimit } from '../../domain/enums/PageLimit';
import { UserAccountFilters } from '../../domain/types/UserAccountFilters';

export class MonumentUserService {
  constructor(private readonly client: IApiClient) { }

  getAllAccountRoles(cookie: string): Promise<APIResponse> {
    return this.client.get(MonumentEndpoints.USER.ACCOUNT.ROLES, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

  getUserAccounts(
    cookie: string,
    filters: UserAccountFilters
  ): Promise<APIResponse> {
    const params = new URLSearchParams();

    if (filters.status) {
      filters.status.forEach((value, index) =>
        params.append(`filters[status][${index}]`, value.toString())
      );
    }

    if (filters.roleId) {
      filters.roleId.forEach((value, index) =>
        params.append(`filters[roles][${index}]`, value)
      );
    }

    if (filters.facilityId) {
      filters.facilityId.forEach((value, index) =>
        params.append(`filters[facilities][${index}]`, value)
      );
    }

    if (filters.nameOrEmailSearch) {
      filters.nameOrEmailSearch.forEach((value, index) =>
        params.append(`filters[nameOrEmailSearch][${index}]`, value)
      );
    }

    params.append("page", String(filters.page ?? 1));
    params.append("limit", String(filters.limit ?? PageLimit.Fifty));


    if (filters.orderBy) {
      Object.entries(filters.orderBy).forEach(([key, value]) => {
        params.append(`order[${key}]`, value);
      });
    }

    const path = `${MonumentEndpoints.USER.ACCOUNT.LIST}?${params.toString()}`;

    console.log("Request:", path);

    return this.client.get(path, {
      [HttpHeaders.COOKIE]: cookie,
    });
  }

}
