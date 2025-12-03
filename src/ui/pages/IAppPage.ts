export interface IAppPage {
    readonly path: string;
    isLoaded(): Promise<boolean>;
}
