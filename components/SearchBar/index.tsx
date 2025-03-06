import React, {useEffect} from "react";
import {SuggestionRow} from "../SuggestionRow";
import {CONFIG} from "../../const/config";

interface SearchBarProps {
    searchTerm: string,
    handleChangeSearchTerm: (searchTerm: string) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    isLoading: boolean,
    handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    handleSearchButtonClick: () => void,

    suggestions: string[],
    currentMovingSuggestionIndex: number,
    handleSuggestionRowPress: (arg0: React.MouseEvent, arg1: string) => void,

}

export const SearchBar = (props: SearchBarProps) => {
    const {
        searchTerm,
        handleChangeSearchTerm,
        inputRef,
        containerRef,
        isLoading,
        handleSearchKeyDown,
        handleSearchButtonClick,

        suggestions,
        currentMovingSuggestionIndex,
        handleSuggestionRowPress
    } = props

    const [inputLength, setInputLength] = React.useState(0);
    const [inputHeight, setInputHeight] = React.useState(0);


    useEffect(() => {
        setInputLength(inputRef.current?.offsetWidth || 0);
        setInputHeight(inputRef.current?.offsetHeight || 0);

        const handleResize = () => {
            setInputLength(inputRef.current?.offsetWidth || 0);
            setInputHeight(inputRef.current?.offsetHeight || 0);
        };
        window.addEventListener('resize', handleResize, {passive: true});

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [inputRef, setInputLength, setInputHeight, isLoading])


    return (
        <div
            ref={containerRef}
        >
            <div className="search-box flex">
                <input
                    value={searchTerm}
                    onChange={e => handleChangeSearchTerm(e.target.value)}
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    className="text-[#282828] w-[100%] flex-grow px-6 py-3 border-solid  border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={handleSearchKeyDown}
                />

                <span>
                    <button
                        className=" flex  justify-center items-center  bg-blue-500 text-white
                        px-8 py-4 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={handleSearchButtonClick}
                    >

                        <span className={'pr-[3px]'}>
                            {isLoading ?
                                (<span
                                    className={'x-spinner spinner-border spinner-border-sm text-gray-500 simple-loader'}
                                    role="status"
                                    aria-hidden="true"
                                />) : (
                                    <span>
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor"
                                                  strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </span>
                                )}
                        </span>
                        <span className={'text-[18px]'}>
                            Search
                        </span>
                </button>
                </span>
            </div>

            {suggestions.length > 0 && (
                <div className="suggestions border border-solid border-gray-300 absolute bg-white z-50"
                     style={{width: `${inputLength}px`}}
                >
                    {suggestions.slice(0, CONFIG.MAX_SUGGESTIONS).map((t, index) => {
                        return (
                            <div key={t}>
                                <SuggestionRow text={t}
                                               highlight={index === currentMovingSuggestionIndex}
                                               handlePress={handleSuggestionRowPress}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}