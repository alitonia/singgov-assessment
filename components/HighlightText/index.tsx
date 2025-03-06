import type {ReactElement} from "react";
import type {TextWithHighlights} from "../../definitions/searchDefinitions";


export const HighlightText = (props: TextWithHighlights) => {
    const {Text, Highlights} = props

    const textBundle: ReactElement[] = []

    const sortedHighlights = Highlights.sort((a, b) => a.BeginOffset - b.BeginOffset)
    let startTmp = 0

    sortedHighlights.forEach((highlight, index) => {
        textBundle.push(<span key={`b-${index}`}>{Text.slice(startTmp, highlight.BeginOffset)}</span>)
        textBundle.push(
            <span className={"text-[#282828] font-semibold highlighted-element"}
                  key={`e-${index}`}>{Text.slice(highlight.BeginOffset, highlight.EndOffset)}</span>
        )
        startTmp = highlight.EndOffset
    })

    if (startTmp < Text.length) {
        textBundle.push(<span key={'lss'}>{Text.slice(startTmp)}</span>)
    }

    return (
        <span>{textBundle}</span>
    )
}