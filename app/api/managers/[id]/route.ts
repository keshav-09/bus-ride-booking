import { updateManager, deleteManager } from "@/lib/manager"; 

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return new Response(
      JSON.stringify({ error: "Name and email are required" }),
      { status: 400 }
    );
  }

  try {
    const updatedManager = await updateManager(parseInt(params.id), name, email);
    return new Response(JSON.stringify(updatedManager), { status: 200 });
  } catch (error) {
    console.error('Error updating manager:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const response = await deleteManager(parseInt(params.id)); 
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
