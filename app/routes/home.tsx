import type {Route} from "./+types/home";
import {SearchPage} from "~/search/SearchPage";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Singgov Assessment"},
        {name: "description", content: "Welcome to the search page!"},
    ];
}

export default function Home() {
    return <SearchPage/>;
}
