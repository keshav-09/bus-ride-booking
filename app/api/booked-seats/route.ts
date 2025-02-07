export const dynamic = "force-dynamic";

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {

    console.log("Request Query:", req.url);
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";

    if (!date || typeof date !== "string") {
        return NextResponse.json({ error: "Invalid or missing date parameter" }, {status: 400});
    }

    try {
        const bookedSeats = await prisma.booking.findMany({
            where: {
                date: new Date(date),
            },
            select: { seatNumber: true },
        });
        return NextResponse.json({ bookedSeats: bookedSeats.map(b => Number(b.seatNumber))}, {status: 200})
    } catch (error) {
        console.error("Error fetching booked seats:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}


