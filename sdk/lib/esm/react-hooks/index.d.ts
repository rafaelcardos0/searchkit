import { SearchkitConfig } from '../';
import { SearchkitResponse } from '../transformers';
export declare const useSearchkitSDK: (config: SearchkitConfig, variables: any) => {
    results: SearchkitResponse;
    loading: boolean;
};
