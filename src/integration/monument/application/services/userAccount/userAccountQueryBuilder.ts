import { OrderField, UserAccountFilters } from "../../../domain/types/UserAccountFilters"; 
import { PageLimit } from "../../../domain/enums/PageLimit"; 
import { MonumentEndpoints } from "../../../constants/MonumentEndpoints";
import { QUERY_PARAM_KEYS } from "./userAccountQueryBuilderConstants";

export function buildListUserAccountFiltering(filters: UserAccountFilters): string {
  const params = new URLSearchParams();

  if (filters.status) {
    filters.status.forEach((value, index) =>
      params.append(`${QUERY_PARAM_KEYS.FILTERS.STATUS}[${index}]`, value.toString())
    );
  }

  if (filters.roles) {
    filters.roles.forEach((value, index) =>
      params.append(`${QUERY_PARAM_KEYS.FILTERS.ROLES}[${index}]`, value)
    );
  }

  if (filters.facilities) {
    filters.facilities.forEach((value, index) =>
      params.append(`${QUERY_PARAM_KEYS.FILTERS.FACILITIES}[${index}]`, value)
    );
  }

  if (filters.nameOrEmailSearch) {
    filters.nameOrEmailSearch.forEach((value, index) =>
      params.append(`${QUERY_PARAM_KEYS.FILTERS.NAME_OR_EMAIL}[${index}]`, value)
    );
  }

  params.append(QUERY_PARAM_KEYS.PAGINATION.PAGE, String(filters.page ?? 1));
  params.append(QUERY_PARAM_KEYS.PAGINATION.LIMIT, String(filters.limit ?? PageLimit.Fifty));

  if (filters.orderBy) {
    filters.orderBy.forEach(([field, direction]) => {
      switch (field) {
        case OrderField.RootRoleName:
          params.append(QUERY_PARAM_KEYS.ORDER.ROOT_ROLE_NAME, direction);
          break;
        case OrderField.FirstName:
          params.append(QUERY_PARAM_KEYS.ORDER.FIRST_NAME, direction);
          break;
        case OrderField.LastName:
          params.append(QUERY_PARAM_KEYS.ORDER.LAST_NAME, direction);
          break;
        case OrderField.Email:
          params.append(QUERY_PARAM_KEYS.ORDER.EMAIL, direction);
          break;
      }
    });
  }

  return `${MonumentEndpoints.USER_ACCOUNT.BASE}?${params.toString()}`;
}
