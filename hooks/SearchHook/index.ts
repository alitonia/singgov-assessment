import React, {type KeyboardEvent, useEffect} from "react";

import {Bounce, toast} from "react-toastify";
import type {SearchResult} from "../../definitions/searchDefinitions";
import {REQUEST_URL} from "../../const/requestURL";
import {ERROR} from "../../const/error";


interface SearchHookProps {
    disable?: boolean
}


export const useSearchHook = (props: SearchHookProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const fetchDataRef = React.useRef<AbortController | null>(null);

    const [searchTerm, setSearchTerm] = React.useState('');

    const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);


    const [isFocused, setIsFocused] = React.useState(false);


    const handleStartSearch = async (searchTerm: string) => {

        setIsLoading(true);
        setError(null);
        setSearchResult(null);

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


    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'Enter':
                handleEnterPress();
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
        setSearchTerm(searchTerm);
    };


    const handleCloseSuggestions = () => {
        setSearchTerm('');
        setTimeout(() => inputRef.current?.focus(), 0);
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
        inputRef,
        searchTerm,
        handleStartSearch,
        searchResult,
        isLoading,
        error,
        handleSearchKeyDown,
        handleCloseSuggestions,
        handleSearchButtonClick,
        handleChangeSearchTerm,
        containerRef
    }
}