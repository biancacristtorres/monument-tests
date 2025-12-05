import { Page, Route } from '@playwright/test';
import { HttpHeaders } from '../../integration/infra/http/constants/HttpHeaders';
import { INetworkMock } from './INetworkMock';

export class NetworkMockService implements INetworkMock {
    private registeredRoutes: Map<string, (route: Route) => Promise<void>> = new Map();
    private static readonly DEFAULT_CONTENT_TYPE = 'application/json';

    constructor(private page: Page) { }

    async mockRequest(
        urlPattern: string,
        response: {
            status?: number;
            contentType?: string;
            body: string | object;
        }
    ): Promise<void> {
        await this.unmockRequest(urlPattern);

        const handler = async (route: Route) => {
            const body =
                typeof response.body === 'string'
                    ? response.body
                    : JSON.stringify(response.body);

            await route.fulfill({
                status: response.status || 200,
                contentType: response.contentType || NetworkMockService.DEFAULT_CONTENT_TYPE,
                body,
            });
        };

        this.registeredRoutes.set(urlPattern, handler);
        await this.page.route(urlPattern, handler);
    }

    async mockRequestStatusOnly(
        urlPattern: string,
        status: number
    ): Promise<void> {
        await this.unmockRequest(urlPattern);

        const handler = async (route: Route) => {
            const response = await route.fetch();
            const body = await response.text();
            const contentTypeHeader = response.headers()[HttpHeaders.CONTENT_TYPE.toLowerCase()] || NetworkMockService.DEFAULT_CONTENT_TYPE;

            await route.fulfill({
                status,
                contentType: contentTypeHeader,
                body,
            });
        };

        this.registeredRoutes.set(urlPattern, handler);
        await this.page.route(urlPattern, handler);
    }

    async unmockRequest(urlPattern: string): Promise<void> {
        const handler = this.registeredRoutes.get(urlPattern);
        if (handler) {
            await this.page.unroute(urlPattern, handler);
            this.registeredRoutes.delete(urlPattern);
        }
    }

    async unmockAll(): Promise<void> {
        for (const [urlPattern] of this.registeredRoutes) {
            await this.unmockRequest(urlPattern);
        }
        this.registeredRoutes.clear();
    }
}
