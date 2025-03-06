import {Banner} from "../../components/Banner";
import {Link} from "react-router";
import {SearchBar} from "../../components/SearchBar";
import {SearchResultList} from "../../components/SearchResultList";
import {useSearchHook} from "../../hooks/SearchHook";

export const SearchPage = () => {
    const talons = useSearchHook({
        disable: false
    })

    return (
        <div className="min-h-screen flex flex-col items-center p-8">
            <Banner text={'Welcome to the Singapore Government'}/>

            <div className="w-full lg:px-[15%] md:px-[5%] py-12">
                <SearchBar {...talons} />
                <SearchResultList {...talons} />
            </div>

            <Link to="/" className="mt-8 text-blue-500 hover:underline">
                Back to Home
            </Link>
        </div>
    );
}