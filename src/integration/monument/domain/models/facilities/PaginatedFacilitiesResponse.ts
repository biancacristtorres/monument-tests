export interface PaginationMeta {
	totalItems: number;
	itemCount: number;
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
}

export interface FacilityModel {
	description: string;
	id: string;
	orgId: string;
	facilityName: string;
	location: string;
	phone: string;
	email: string;
	state: string;
	city: string;
	zip: string;
	organizationUuid: string;
	vacantUnits: number;
	facilityGateIntegrationVendorUuid: string | null;
	timeZone: string;
	facilityGroups: string[];
}

export interface PaginatedFacilitiesResponse {
	meta: PaginationMeta;
	items: FacilityModel[];
}
