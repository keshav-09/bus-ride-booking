import { NextApiRequest, NextApiResponse } from "next";
import { getAllLocations } from "@/lib/location";  // Import your location function
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); 

  try {
    // Fetch all locations from the database
    const {locations, total} = await getAllLocations({ page, limit }); // This should return an array of locations

    // Return the locations in the response
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
