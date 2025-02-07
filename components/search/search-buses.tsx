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

                console.log("Locations: ", data)

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

            const { fares = [], }: { fares: Bus[] } = await response.json();

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
                <form method="get" className="flex h-[8vh] w-[50vw] items-center" onSubmit={handleSearch}>
                    {/* Origin Dropdown */}
                    <div className="w-1/3">
                        <select
                            id="origin"
                            name="origin"
                            className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2 text-black focus:border-gray-500 focus:outline-none"
                        >
                            <option value="" disabled selected>
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
                    <div className="w-1/3 mx-2">
                        <select
                            id="destination"
                            name="destination"
                            className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2 text-black focus:border-gray-500 focus:outline-none"
                        >
                            <option value="" disabled selected>
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
                        className=" rounded-lg bg-black px-5 py-2 text-white font-semibold transition duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Search
                    </button>
                </form>
            </div>

            {availableBuses.length > 0 ? (
                <div className="flex flex-wrap gap-2 ">
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
        </>
    );
};

export default SearchBuses;