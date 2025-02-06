import { getRouteById, updateRoute, deleteRoute } from "@/lib/route"; 
import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------------
// GET Request - To Get Route By ID
// ----------------------------------------------------------------------------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const routeId = url.pathname.split("/").pop(); 

  if (!routeId) {
    return new NextResponse(
      JSON.stringify({ error: "Route ID is required" }),
      { status: 400 }
    );
  }

  try {
    const route = await getRouteById(routeId);

    if (!route) {
      return new NextResponse(
        JSON.stringify({ error: "Route not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(route),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------------
// PUT Request - To Update Route by ID
// ----------------------------------------------------------------------------
export async function PUT(req: Request) {
  const routeId = req.url.split("/").pop(); 
  const { originId, destinationId, vehicleId, departureTime, arrivalTime, userId } = await req.json();

  if (!routeId) {
    return new NextResponse(
      JSON.stringify({ error: "Route ID is required" }),
      { status: 400 }
    );
  }

  if (!originId && !destinationId && !vehicleId && !departureTime && !arrivalTime && !userId) {
    return new NextResponse(
      JSON.stringify({ error: "At least one field is required for updating the route" }),
      { status: 400 }
    );
  }


  const formattedDepartureTime = formatTime(departureTime); 
  const formattedArrivalTime = formatTime(arrivalTime);     

  try {
    const updatedRoute = await updateRoute(routeId, {
      originId,
      destinationId,
      vehicleId,
      departureTime: formattedDepartureTime, 
      arrivalTime: formattedArrivalTime,      
      userId
    });

    if (updatedRoute.error) {
      return new NextResponse(JSON.stringify(updatedRoute), { status: 400 });
    }

    return new NextResponse(
      JSON.stringify(updatedRoute),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------------
// DELETE Request - To Delete Route by ID
// ----------------------------------------------------------------------------
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const routeId = url.pathname.split("/").pop();

  if (!routeId) {
    return new NextResponse(
      JSON.stringify({ error: "Route ID is required" }),
      { status: 400 }
    );
  }

  try {
    const deletionResult = await deleteRoute(routeId);

    if (deletionResult.error) {
      return new NextResponse(JSON.stringify(deletionResult), { status: 400 });
    }

    return new NextResponse(
      JSON.stringify(deletionResult),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

function formatTime(time: string): string {
  const timeParts = time.split(':');
  if (timeParts.length !== 2 && timeParts.length !== 3) {
    throw new Error('Invalid time format. Expected HH:mm or HH:mm:ss');
  }


  if (timeParts.length === 2) {
    timeParts.push('00');
  }

  return timeParts.join(':');  
}
