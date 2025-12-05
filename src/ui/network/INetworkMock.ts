
export interface INetworkMock {

    mockRequest(
        urlPattern: string,
        response: {
            status?: number;
            contentType?: string;
            body: string | object;
        }
    ): Promise<void>;
    unmockRequest(urlPattern: string): Promise<void>;
    unmockAll(): Promise<void>;
}
