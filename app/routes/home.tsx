import type {Route} from "./+types/home";
import {Welcome} from "~/welcome/welcome";
import {Banner} from "../../components/Banner";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Singgov Assessment"},
        {name: "description", content: "Welcome to the search page!"},
    ];
}

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center p-8">
            <Banner text={'Welcome to the Singapore Government'}/>


            <Link to="/" className="mt-8 text-blue-500 hover:underline">
                Back to Home
            </Link>
        </div>
    );
}
