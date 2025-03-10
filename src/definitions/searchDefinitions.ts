export interface TextHighlight {
    BeginOffset: number;
    EndOffset: number;
}

export interface TextWithHighlights {
    Text: string;
    Highlights: TextHighlight[];
}

export interface SearchResultItem {
    DocumentId: string;
    DocumentTitle: TextWithHighlights;
    DocumentURI: string;
    DocumentExcerpt: TextWithHighlights;
    Id?: string;
    Type?: string;
}

export interface SearchResult {
    Page: number;
    PageSize: number;
    TotalNumberOfResults: number;
    ResultItems: SearchResultItem[];
}

export interface SearchSuggestionResult {
    stemmedQueryTerm: string;
    suggestions: string[];
}