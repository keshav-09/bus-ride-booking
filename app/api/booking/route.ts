import { addBooking, getAllBookings } from "@/lib/booking";
import { getFareById } from "@/lib/fare";
import { getRouteById } from "@/lib/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { userId, fareId, seatNo, date } = await req.json();

        // Validate required inputs
        if (!userId || !fareId) {
            return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
        }

        const bus = await getFareById(fareId)
        const route = await getRouteById(bus?.routeId as string);
        console.log({route});
        const bookingData = {
            routeId: bus?.routeId as string,
            userId: userId,
            fromLocationId: bus?.fromLocationId as string,
            toLocationId: bus?.toLocationId as string,
            date: new Date(date).toISOString(),
            seatNumber: seatNo,
            bookingStatus: "pending",
            fareId: fareId,
            availableSeats: route?.vehicle.seats as number -1
        }

        const result = await addBooking(bookingData);

        console.log({result});
        // Check if the booking was successful
        if(result?.error)   
            return NextResponse.json(result, { status: 400 });
        return NextResponse.json(result, { status: 201 });
        // return NextResponse.json({ success: true, booking: result }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating booking:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

