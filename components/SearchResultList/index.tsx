import React from "react";
import classNames from "classnames";
import type {SearchResult} from "../../definitions/searchDefinitions";
import {SearchResultRecord} from "../SearchResultRecord";

interface SearchResultProps {
    searchResult: SearchResult | null,
    isLoading: boolean,
    error: string | null,
}

export const SearchResultList = (props: SearchResultProps) => {
    const {
        searchResult,
        isLoading,
        error,
    } = props

    if (isLoading || !searchResult) {
        return null
    }
    if (error) {
        return (
            <div className="text-center text-red-800">
                {error}
            </div>
        )
    }

    const {
        Page,
        PageSize,
        TotalNumberOfResults,
        ResultItems,
    } = searchResult

    const pageCount = Math.ceil(TotalNumberOfResults / PageSize)

    return (
        <div className={'py-12'}>
            <div className="flex items-center justify-between">
                <span
                    className={"text-[#282828] font-semibold text-xl"}>{`Showing ${Page}/${pageCount} of ${TotalNumberOfResults} results`}</span>
            </div>
            <div className="search-result-list py-11 flex flex-col gap-4">
                {ResultItems.map((result) => {
                    return (
                        <div className={"mb-10"}
                             key={result.DocumentId}>
                            <SearchResultRecord result={result}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}