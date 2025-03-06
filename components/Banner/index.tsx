interface BannerProps {
    text: string;
}

export const Banner = (props: BannerProps) => {
    const {text} = props;

    return (
        <div
            className="absolute top-0 left-0 right-0 p-0 bg-[#f0f0f0] text-[#5b5b5b] text-center flex justify-center items-center text-xs md:justify-start md:pl-[20%]">
                <span className={'p-3'}>
                    <img src={'/image/singapore-logo.svg'}
                         alt={'singapore logo'}
                         width={16} height={16} loading={"lazy"}
                    />
                </span>
            <span>{text}</span>
        </div>
    )
}