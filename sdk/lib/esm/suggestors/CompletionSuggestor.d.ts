import { SearchkitTransporter } from '../transporters';
import { BaseSuggestor, BaseSuggestorResponse } from '.';
export interface CompletionSuggesterOptions {
    index?: string;
    identifier: string;
    field: string;
    size?: number;
    skip_duplicates?: boolean;
}
export interface CompletionSuggesterResponse extends BaseSuggestorResponse {
    identifier: string;
    suggestions: string[];
}
export declare class CompletionSuggester implements BaseSuggestor<CompletionSuggesterResponse> {
    options: CompletionSuggesterOptions;
    constructor(options: CompletionSuggesterOptions);
    getSuggestions(query: string, transport: SearchkitTransporter): Promise<CompletionSuggesterResponse>;
}
