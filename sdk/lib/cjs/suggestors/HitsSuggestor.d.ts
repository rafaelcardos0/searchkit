import { CustomHighlightConfig } from '..';
import { BaseQuery } from '../query';
import { SearchkitTransporter } from '../transporters';
import { SearchkitHit } from '../transformers';
import { BaseSuggestor, BaseSuggestorResponse } from '.';
export interface HitsSuggestorResponse extends BaseSuggestorResponse {
    hits: SearchkitHit[];
}
export interface HitsSuggestorOptions {
    index?: string;
    identifier: string;
    hits: {
        fields: string[];
        highlightedFields?: (string | CustomHighlightConfig)[];
    };
    query: BaseQuery;
    size?: number;
}
export declare class HitsSuggestor implements BaseSuggestor<HitsSuggestorResponse> {
    options: HitsSuggestorOptions;
    constructor(options: HitsSuggestorOptions);
    getSuggestions(query: string, transport: SearchkitTransporter): Promise<HitsSuggestorResponse>;
}
