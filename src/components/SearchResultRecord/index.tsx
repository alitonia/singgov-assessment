import React from "react";
import {HighlightText} from "../HighlightText";
import type {SearchResultItem} from "../../definitions/searchDefinitions";
import {Link} from "react-router";

interface SearchResultItemProps {
    result: SearchResultItem,
}

export const SearchResultRecord = (props: SearchResultItemProps) => {
    const {result} = props;

    return (
        <div className="search-result-item text-[#282828]">
            <h3 className={"text-[#1c76d5] font-semibold text-xl"}>
                <Link to={result.DocumentURI}>
                    {result.DocumentTitle.Text}
                </Link>
            </h3>

            <h5 className={'mt-2 mb-4'}>
                <HighlightText Text={result.DocumentExcerpt.Text}
                               Highlights={result.DocumentExcerpt.Highlights}
                />
            </h5>

            <h6 className={'text-[#777] result-link'}>
                <Link to={result.DocumentURI}>
                    {result.DocumentURI}
                </Link>
            </h6>
        </div>
    )
}