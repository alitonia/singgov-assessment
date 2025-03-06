import React from "react";
import classNames from "classnames";

interface SuggestionRowProps {
    text: string,
    highlight: boolean,
    handlePress: (arg0: React.MouseEvent, arg1: string) => void,
}

export const SuggestionRow = (props: SuggestionRowProps) => {
    const {text, highlight, handlePress} = props;

    return (
        <div className={
            classNames(
                "text-[#282828]  flex-grow px-6 py-3 hover:outline-none hover:ring-2",
                {"highlight ring-2 ring-blue-400 ring-offset-0": highlight}
            )
        }
             onClick={(e) => {
                 handlePress(e, text)
             }}
        >
            <span className={'suggestion-text-value'}>{text}</span>
        </div>
    )
}