// intercept all fetch requests and modify return data
import {REQUEST_URL} from "../const/requestURL";
import type {SearchResult, SearchResultItem} from "../definitions/searchDefinitions";
import {findOffsetPairs} from "../utils/findOffsetPairs";

const isNode = typeof window === 'undefined';
const globalObj = isNode ? global : window;

const originalFetch = globalObj.fetch;

const DEFAULT_SEARCH_TERM = 'child'

globalObj.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let url;
    if (typeof input === 'string') {
        url = new URL(input);
    } else if (input instanceof URL) {
        url = input;
    } else {
        // If input is a Request object
        url = new URL(input.url);
    }
    const isSuggestionsApi = url.toString().includes(REQUEST_URL.SUGGESTIONS_API);
    const isDataApi = url.toString().includes(REQUEST_URL.DATA_API);

    const text = (url.searchParams.get('text') || "").toLowerCase();

    if (
        (!isSuggestionsApi && !isDataApi) ||
        text === DEFAULT_SEARCH_TERM
    ) {
        return originalFetch(input, init);
    }

    console.log("filter with", text)

    url.searchParams.delete('text')

    const response = await originalFetch(url, init);

    if (isSuggestionsApi) {
        const data = await response.json();
        const modifiedSuggestion = {
            stemmedQueryTerm: text,
            suggestions: data.suggestions.filter((t: string) => t.includes(text)) || [],
        }
        console.log('suggestion', modifiedSuggestion)
        return new Response(JSON.stringify(modifiedSuggestion), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }
    if (isDataApi) {
        const data: SearchResult = await response.json();
        console.log('datat', data)

        const modifiedResultItem = data.ResultItems.filter(
            r => (
                r.DocumentTitle.Text.toLowerCase().includes(text) ||
                r.DocumentExcerpt.Text.toLowerCase().includes(text))
        ).map(r => ({
            ...r,
            DocumentId: r.DocumentId,
            DocumentTitle: {
                Text: r.DocumentTitle.Text,
                Highlights: findOffsetPairs(r.DocumentTitle.Text.toLowerCase(), text.toLowerCase()) || [],
            },
            DocumentURI: r.DocumentURI,
            DocumentExcerpt: {
                Text: r.DocumentExcerpt.Text,
                Highlights: findOffsetPairs(r.DocumentExcerpt.Text.toLowerCase(), text.toLowerCase()) || [],
            },
            Id: r.Id,
            Type: r.Type,

        }))
        const modifiedData = {
            Page: 1,
            PageSize: data.PageSize,
            TotalNumberOfResults: modifiedResultItem.length < data.PageSize ? modifiedResultItem.length : data.TotalNumberOfResults,
            ResultItems: modifiedResultItem,
        }
        console.log('data', modifiedData)

        return new Response(JSON.stringify(modifiedData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }
    return response;

}

