import { createManager, getAllManagers } from "@/lib/manager"; 


export async function POST(req: Request) {
  const { name, email } = await req.json();


  if (!name || !email) {
    return new Response(
      JSON.stringify({ error: "Name and email are required" }),
      { status: 400 }
    );
  }

  try {
    const newManager = await createManager(name, email); 
    return new Response(JSON.stringify(newManager), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); 

  try {
    const { managers, total } = await getAllManagers(page, limit); 

   
    return new Response(
      JSON.stringify({
        data: managers,
        total, 
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
