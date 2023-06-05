import { RequestBody } from '@elastic/elasticsearch-types';
import { SearchkitConfig } from '..';
import { SearchkitTransporter, SearchkitTransporterOverrides } from '.';
export default class FetchClientTransporter implements SearchkitTransporter {
    private config;
    constructor(config: SearchkitConfig);
    performRequest(requestBody: RequestBody, overrides?: SearchkitTransporterOverrides): Promise<any>;
}
