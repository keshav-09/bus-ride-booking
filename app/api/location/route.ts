// pages/api/locations.ts

import { getAllLocationsWithoutPagination } from "@/lib/location"; // Adjust the import path based on your project structure
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {

    try {
        const locations = await getAllLocationsWithoutPagination(); // Fetch locations from your library function
        return NextResponse.json(locations); // Return the locations as JSON
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" });
    }
}