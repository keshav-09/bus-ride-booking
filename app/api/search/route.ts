// /pages/api/fares/index.ts
// import { getFaresByFilter } from "@/lib/fare";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(req: NextRequest, res: Response) {
//     // return NextResponse.json({ error: "Temporarily Disabled" });

//     try {
//         const { searchParams } = req?.nextUrl; // Access the URL's query parameters
//         const origin = searchParams?.get("origin") || "";
//         const destination = searchParams?.get("destination") || "";


//         const allFares = await getFaresByFilter({
//             origin: origin,
//             destination: destination
//         });

//         return NextResponse.json(allFares);

//     } catch (error) {
//         console.error("Error fetching fares:", error);
//         return NextResponse.json({ error: "Internal server error" });
//     }
// }

export const dynamic = "force-dynamic";

import { getFaresByFilter } from "@/lib/fare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const origin = searchParams.get("origin") || "";
        const destination = searchParams.get("destination") || "";

        const allFares = await getFaresByFilter({ origin, destination });

        return NextResponse.json(allFares);
    } catch (error) {
        console.error("Error fetching fares:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
