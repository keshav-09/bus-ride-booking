import { addRoute, getAllRoutes} from "@/lib/route"; 

// ----------------------------------------------------------------------------
// POST Request - To Add a Route
// ----------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const { originId, destinationId, vehicleId, departureTime, arrivalTime, userId } = await req.json();

    if (!originId || !destinationId || !vehicleId || !departureTime || !arrivalTime  || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields (origin, destination, vehicle, departure time, arrival time, userId) are required" }),
        { status: 400 }
      );
    }

    const departureTimeFormatted = formatTime(departureTime); 
    const arrivalTimeFormatted = formatTime(arrivalTime);  

    const newRoute = await addRoute({
      originId,
      destinationId,
      vehicleId,
      departureTime: departureTimeFormatted,  
      arrivalTime: arrivalTimeFormatted,   
      userId
    });


    if (newRoute.error) {
      return new Response(JSON.stringify(newRoute), { status: 400 });
    }

    return new Response(JSON.stringify(newRoute), { status: 201 });
  } catch (error) {
    console.error('Error in POST Route:', error);
    return new Response(
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

// ----------------------------------------------------------------------------
// GET Request - To Get All Routes with Pagination
// ----------------------------------------------------------------------------
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); 

  try {
    const routes = await getAllRoutes(); 
    const paginatedRoutes = routes.slice((page - 1) * limit, page * limit); 

    return new Response(
      JSON.stringify({
        data: paginatedRoutes,
        total: routes.length, 
        page,
        limit,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

