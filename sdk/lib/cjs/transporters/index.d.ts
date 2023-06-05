export interface SearchkitTransporterOverrides {
    index?: string;
}
export interface SearchkitTransporter {
    performRequest(requestBody: any, overrides?: SearchkitTransporterOverrides): Promise<any>;
}
export { default as FetchClientTransporter } from './FetchClientTransporter';
