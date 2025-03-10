import React, {type KeyboardEvent, useEffect} from "react";

import {Bounce, toast} from "react-toastify";
import type {SearchResult, SearchSuggestionResult} from "../../definitions/searchDefinitions";
import {REQUEST_URL} from "../../const/requestURL";
import {ERROR} from "../../const/error";
import {useDebouncedCallback} from "use-debounce";
import {useQuery} from "../shared/useQuery";


interface SearchHookProps {
    disable?: boolean
}

const DEFAULT_INDEX = -1

export const useSearchHook = (props: SearchHookProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const fetchDataRef = React.useRef<AbortController | null>(null);
    const fetchSuggestionRef = React.useRef<AbortController | null>(null);

    const [searchTerm, setSearchTerm] = React.useState('');

    const [currentMovingSuggestionIndex, setCurrentMovingSuggestionIndex] = React.useState(DEFAULT_INDEX);

    const [showResetButton, setShowResetButton] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const searchUrl = (function () {
        const url = new URL(REQUEST_URL.DATA_API)
        url.searchParams.set('text', searchTerm);
        return url.toString();
    })()

    const {
        fetchData: fetchSearchData,
        isLoading: isLoadingSearch,
        error: errorSearch,
        data: searchResult
    }: {
        fetchData: () => Promise<void>,
        isLoading: boolean,
        error: string | null,
        data: SearchResult | null
    } = useQuery({
        url: searchUrl
    })


    const {
        fetchData: fetchSuggestionData,
        data: suggestionData,
        setData: _setSuggestionData,
    }: {
        fetchData: (arg0: string) => Promise<void>,
        data: SearchSuggestionResult | null,
        setData: (data: [] | null) => void
    } = useQuery({})

    useEffect(() => {
        console.log(suggestionData)
    }, [suggestionData])

    const suggestions = (suggestionData ? suggestionData.suggestions : null) || [];

    const hideSuggestions = () => {
        setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        _setSuggestionData([]);
    }

    const fetchSuggestions = async (term: string) => {
        const suggestionUrl = (function () {
            const url = new URL(REQUEST_URL.SUGGESTIONS_API)
            url.searchParams.set('text', term);
            return url.toString();
        })()

        fetchSuggestionData(suggestionUrl)
    };

    const debouncedFetchSuggestions = useDebouncedCallback(
        (value) => {
            fetchSuggestions(value);
        },
        300
    );

    const handleSearchBoxFocus = () => {
        if (searchTerm.length > 2) {
            debouncedFetchSuggestions(searchTerm);
        }
    }

    const handleFocus = () => {
        setIsFocused(true);
        handleSearchBoxFocus();
    };

    const handleBlurSearchTerm = (e: React.FocusEvent) => {
        e.preventDefault()
        setTimeout(() => {
            hideSuggestions()
        }, 200)
    }

    const handleBlur = (e: React.FocusEvent) => {
        setTimeout(() => {
            if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
                setIsFocused(false);
                handleBlurSearchTerm(e);
            }
        }, 100)
    };

    const handleStartSearch = async (searchTerm: string) => {
        hideSuggestions()
        fetchSearchData()
    }

    const handleEnterPress = () => {
        if (currentMovingSuggestionIndex >= 0 && currentMovingSuggestionIndex < suggestions.length) {
            setSearchTerm(suggestions[currentMovingSuggestionIndex]);
            return handleStartSearch(suggestions[currentMovingSuggestionIndex])
        }
        hideSuggestions()
        return handleStartSearch(searchTerm)
    }

    const handleArrowUpMove = () => {
        if (currentMovingSuggestionIndex > 0 && suggestions.length > currentMovingSuggestionIndex) {
            setCurrentMovingSuggestionIndex(currentMovingSuggestionIndex - 1);
        }
    }
    const handleArrowDownMove = () => {
        if (
            currentMovingSuggestionIndex < suggestions.length - 1 &&
            suggestions.length > 0 &&
            currentMovingSuggestionIndex + 1 <= suggestions.length
        ) {
            setCurrentMovingSuggestionIndex(currentMovingSuggestionIndex + 1);
        }
    }

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'Enter':
                handleEnterPress();
                break;
            case 'ArrowUp':
                handleArrowUpMove();
                break;
            case 'ArrowDown':
                handleArrowDownMove();
                break;
            default:
                return;
        }
    }

    const handleSearchButtonClick = () => {
        if (isLoadingSearch) {
            return
        }
        return handleStartSearch(searchTerm);
    }

    const handleChangeSearchTerm = (searchTerm: string) => {
        setSearchTerm(function (preSearchTerm) {
            if (preSearchTerm !== searchTerm) {
                if (searchTerm.length > 0) {
                    setShowResetButton(true);
                } else {
                    setShowResetButton(false);
                }
                if (searchTerm.length > 2) {
                    debouncedFetchSuggestions(searchTerm);
                } else {
                    hideSuggestions()
                }
                return searchTerm;
            }
            return preSearchTerm;
        });
    };

    const handleCloseSuggestions = () => {
        hideSuggestions()
        setShowResetButton(false);
        setSearchTerm('');
        setTimeout(() => inputRef.current?.focus())
    }

    const handleSuggestionRowPress = (e: React.MouseEvent, text: string) => {
        setSearchTerm(text);

        hideSuggestions()
        return handleStartSearch(text)
    }

    const handleMouseEnterSuggestionRow = (e: React.MouseEvent, index: number) => {
        setCurrentMovingSuggestionIndex(index);
    }

    const showErrorToast = (text: string) => {
        toast.error(text, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        })
    }

    useEffect(() => {
        if (errorSearch) {
            showErrorToast(errorSearch)
        }
    }, [errorSearch])

    return {
        searchTerm,
        handleChangeSearchTerm,
        inputRef,
        containerRef,
        isLoading: isLoadingSearch,
        handleSearchKeyDown,
        handleSearchButtonClick,

        handleStartSearch,
        searchResult,
        error: errorSearch,

        suggestions,
        currentMovingSuggestionIndex,
        handleSuggestionRowPress,

        handleBlurSearchTerm,
        handleSearchBoxFocus,
        handleCloseSuggestions,
        showResetButton,

        handleMouseEnterSuggestionRow
    }
}