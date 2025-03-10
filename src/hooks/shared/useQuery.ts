import React, {useEffect} from "react";
import {ERROR} from "../../const/error";

interface QueryProps {
    url?: string,
}

export const useQuery = (props: QueryProps) => {

    const {url: defaultURL} = props

    const fetchRef = React.useRef<AbortController | null>(null);

    const [data, setData] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = async (url?: string) => {
        if (fetchRef.current !== null) {
            fetchRef.current.abort();
        }
        const finalURL = url || defaultURL;

        if (!finalURL) {
            throw new Error(ERROR.INVALID_URL);
        }

        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const controller = new AbortController();
            fetchRef.current = controller;

            const response = await fetch(finalURL, {signal: controller.signal});

            if (!response.ok) {
                throw new Error(ERROR.NETWORK_ERROR);
            }
            const data = await response.json();
            fetchRef.current = null;
            setData(data);
            setIsLoading(false)
            setError(null)
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError(ERROR.DATA_API_ERROR);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        data,
        isLoading,
        error,
        fetchData,
        setData
    }
}