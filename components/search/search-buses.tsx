"use client";

import React, { useEffect, useState } from "react";
import { EmptyPlaceholder } from "../shared/empty-placeholder";
import AvailableBusCard from "./buses-card";
import { getAllLocations } from "@/lib/location";

interface Location {
    id: string;
    name: string;
}

interface Bus {
    id: string;
    name: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    fare: number;
    route: string;
}

const SearchBuses = () => {
    const [locations, setLocations] = useState<Location[]>([]); // Store locations data
    const [loading, setLoading] = useState(true); // Track loading state
    const [availableBuses, setAvailableBuses] = useState<Bus[]>([]); // State for search results


    // Fetch locations from the API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                console.log("Fetching locations...");
                const response = await fetch("/api/location", {
                    method: "GET", // Ensure GET method is specified
                });
                const data = await response.json();
                console.log(data);

                setLocations(data);
                console.log("Locations fetched successfully:", data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const origin = formData.get("origin") as string;
        const destination = formData.get("destination") as string;

        console.log({ origin, destination });

        if (!origin || !destination) {
            alert("Please select both origin and destination");
            return;
        }

        console.log(`Searching for buses from ${origin} to ${destination}`);

        try {
            const response = await fetch(`/api/search?origin=${origin}&destination=${destination}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch buses.");
            }

            const result: Bus[] = await response.json();
            console.log("Search results:", result);

            if (result.length > 0) {
                setAvailableBuses(result); // Update state with search results
            } else {
                setAvailableBuses([]); // Clear results if no buses are found
                console.log("No buses found for the selected route.");
            }
        } catch (error) {
            console.error("Error searching buses:", error);
        }
    };

    return (
        <>

            <div className="flex items-center justify-center ">
                <form method="get" className=" w-[60vw] h-[10vh] rounded-3xl flex" onSubmit={handleSearch} >

                    {/* Origin Dropdown */}
                    <div className="w-[40%] h-full rounded-3xl">

                        <select
                            id="origin"
                            name="origin"
                            // defaultValue={origin || ""}
                            className="w-full h-[100%] px-8 py-2 rounded-l-3xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
                        >
                            <option value="" disabled>
                                Select Origin
                            </option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Destination Dropdown */}
                    <div className="w-[40%] h-full bg-slate-500 rounded-3xl">

                        <select
                            id="desination"
                            name="destination"
                            className="w-full h-[100%] px-8 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
                        >

                            <option value="" disabled>
                                Select Destination
                            </option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="w-[20%] bg-zinc-900 text-lg text-white py-2 px-5 rounded-r-3xl hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2"
                    >
                        Search
                    </button>
                </form>
            </div>

            <EmptyPlaceholder>
                {availableBuses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableBuses.map((bus) => (
                            <AvailableBusCard
                                id={bus.id}
                                busName={bus.route.vehicle.name}
                                startLocation={bus.route.origin.name}
                                startTime={bus.route.departureTime}
                                endLocation={bus.route.destination.name}
                                endTime={bus.route.arrivalTime}
                                vehicleNumber={bus.route.vehicle.number}
                                userStartLocation={bus.origin.name}
                                userEndLocation={bus.destination.name}
                                fare={bus.price}
                                type={bus.route.vehicle.type}
                                availableSeats={bus.route.vehicle.seats}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyPlaceholder>
                        <p>No buses found for the selected route.</p>
                    </EmptyPlaceholder>
                )}
            </EmptyPlaceholder>
        </>
    );
};

export default SearchBuses;
