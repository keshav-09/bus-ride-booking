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
    origin: any;
    destination: any;
    departureTime: string;
    arrivalTime: string;
    fare: number;
    route: any;
    price: number;
}

const SearchBuses = () => {
    const [locations, setLocations] = useState<any[]>([]); // Store locations data
    const [loading, setLoading] = useState(true); // Track loading state
    const [availableBuses, setAvailableBuses] = useState<Bus[]>([]); // State for search results
    const [error, setError] = useState("");


    // Fetch locations from the API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                console.log("Fetching locations")

                const response = await fetch("/api/locations");
                const data = await response.json();

                console.log("Locations: ",data)

                if (response.ok) {
                  setLocations(data.locations || []); // Ensure locations is set to an empty array if missing
                  console.log(response)
                } else {
                  setError(data.error || "Failed to fetch locations");
                }
              } catch (error) {
                setError("Error fetching locations");
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

            const  {fares=[], }:{fares:Bus[]} = await response.json();

            if (fares.length > 0) {
                setAvailableBuses(fares); // Update state with search results
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
                <form method="get" className=" flex h-[10vh] w-[60vw] rounded-3xl" onSubmit={handleSearch} >

                    {/* Origin Dropdown */}
                    <div className="h-full w-2/5 rounded-3xl">

                        <select
                            id="origin"
                            name="origin"
                            // defaultValue={origin || ""}
                            className="sm:text-md size-full rounded-l-3xl border-gray-300 px-8 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                    <div className="h-full w-2/5 rounded-3xl bg-slate-500">

                        <select
                            id="desination"
                            name="destination"
                            className="sm:text-md size-full border-gray-300 px-8 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >

                            <option value="" disabled>
                                Select Destination
                            </option>
                            {Array.isArray(locations) && locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="w-1/5 rounded-r-3xl bg-zinc-900 px-5 py-2 text-lg text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2"
                    >
                        Search
                    </button>
                </form>
            </div>

            <EmptyPlaceholder>
                {availableBuses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {availableBuses.map((bus) => (
                            
                            <AvailableBusCard
                                id={bus.id}
                                busName={bus.route.vehicle.name}
                                startLocation={bus.route?.origin.name}
                                startTime={bus.route?.departureTime}
                                endLocation={bus.route?.destination.name}
                                endTime={bus.route?.arrivalTime}
                                vehicleNumber={bus.route?.vehicle.number}
                                userStartLocation={bus.origin.name}
                                userEndLocation={bus.destination.name}
                                fare={bus.price}
                                type={bus.route?.vehicle.type}
                                availableSeats={bus.route?.vehicle.seats}
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