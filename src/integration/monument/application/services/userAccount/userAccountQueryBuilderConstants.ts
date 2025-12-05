export const QUERY_PARAM_KEYS = {
  FILTERS: {
    STATUS: 'filters[status]',
    ROLES: 'filters[roles]',
    FACILITIES: 'filters[facilities]',
    NAME_OR_EMAIL: 'filters[nameOrEmailSearch]',
  },
  ORDER: {
    ROOT_ROLE_NAME: 'order[rootRole][name]',
    FIRST_NAME: 'order[firstName]',
    LAST_NAME: 'order[lastName]',
    EMAIL: 'order[email]',
  },
  PAGINATION: {
    PAGE: 'page',
    LIMIT: 'limit',
  },
} as const;
