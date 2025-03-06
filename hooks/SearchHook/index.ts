import React, {type KeyboardEvent, useEffect} from "react";

import {Bounce, toast} from "react-toastify";
import type {SearchResult} from "../../definitions/searchDefinitions";
import {REQUEST_URL} from "../../const/requestURL";
import {ERROR} from "../../const/error";
import {useDebouncedCallback} from "use-debounce";


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

    const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [suggestions, setSuggestion] = React.useState<string[]>([]);
    const [currentMovingSuggestionIndex, setCurrentMovingSuggestionIndex] = React.useState(DEFAULT_INDEX);

    const [showResetButton, setShowResetButton] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);


    const fetchSuggestions = async (term: string) => {
        if (fetchSuggestionRef.current !== null) {
            fetchSuggestionRef.current.abort();
        }
        try {
            const controller = new AbortController();
            fetchSuggestionRef.current = controller;

            const url = new URL(REQUEST_URL.SUGGESTIONS_API)
            url.searchParams.set('text', searchTerm);

            const response = await fetch(url.toString(), {signal: controller.signal});

            if (!response.ok) {
                throw new Error(ERROR.SUGGESTION_API_ERROR);
            }
            const data = await response.json();
            fetchSuggestionRef.current = null;
            // should have a dynamic API for this though
            setSuggestion(data.suggestions);
            setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
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
            // setSuggestion([]);
            setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        }, 100)
    }

    const handleBlur = (e: React.FocusEvent) => {
        setTimeout(() => {
            if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
                setIsFocused(false);
                handleBlurSearchTerm(e);
            }
        }, 0);
    };

    const handleStartSearch = async (searchTerm: string) => {

        setIsLoading(true);
        setError(null);
        setSearchResult(null);
        setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        setSuggestion([]);

        if (fetchDataRef.current !== null) {
            fetchDataRef.current.abort();
        }
        try {
            const controller = new AbortController();
            fetchDataRef.current = controller;

            const url = new URL(REQUEST_URL.DATA_API)
            url.searchParams.set('text', searchTerm);

            const response = await fetch(url.toString(), {signal: controller.signal});

            if (!response.ok) {
                throw new Error(ERROR.NETWORK_ERROR);
            }
            const data = await response.json();
            fetchDataRef.current = null;
            setSearchResult(data);

        } catch (error) {
            console.error('Error fetching search results:', error);
            setError(ERROR.DATA_API_ERROR);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEnterPress = () => {
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
        if (isLoading) {
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
                    setSuggestion([]);
                }
                return searchTerm;
            }
            return preSearchTerm;
        });
    };

    const handleCloseSuggestions = () => {
        setSuggestion([]);
        setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        setShowResetButton(false);
        setSearchTerm('');
        setTimeout(() => inputRef.current?.focus())
    }

    const handleSuggestionRowPress = (e: React.MouseEvent, text: string) => {
        setSearchTerm(text);

        setSuggestion([]);
        setCurrentMovingSuggestionIndex(DEFAULT_INDEX);
        return handleStartSearch(text)
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
        if (error) {
            showErrorToast(error)
        }
    }, [error])

    return {
        searchTerm,
        handleChangeSearchTerm,
        inputRef,
        containerRef,
        isLoading,
        handleSearchKeyDown,
        handleSearchButtonClick,

        handleStartSearch,
        searchResult,
        error,

        suggestions,
        currentMovingSuggestionIndex,
        handleSuggestionRowPress
    }
}