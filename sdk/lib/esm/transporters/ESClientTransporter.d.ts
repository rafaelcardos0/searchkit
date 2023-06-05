import { SearchkitConfig } from '..';
import type { SearchkitTransporter } from '.';
export default class ESClientTransporter implements SearchkitTransporter {
    private config;
    private client;
    constructor(config: SearchkitConfig);
    performRequest(requestBody: any): Promise<any>;
}
