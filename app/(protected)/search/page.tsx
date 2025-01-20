import React from "react";
import SearchBusesForm from "@/components/search/search-buses";
import { DashboardHeader } from "@/components/dashboard/header";

const SearchBusesPage = async () => {

    return (
        <>
            <DashboardHeader
                heading="Search for Buses"
            />

            <SearchBusesForm />

        </>
    );
};

export default SearchBusesPage;
