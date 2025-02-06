import { NextRequest, NextResponse } from 'next/server';
import { updateLocation } from '@/lib/location';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('Location ID:', params.id); // Debugging the location ID

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
    }

    // Perform the update
    const updatedLocation = await updateLocation(params.id, name);
    return NextResponse.json(updatedLocation, { status: 200 });
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging

    // Ensure we handle non-standard errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to update location', details: errorMessage }, { status: 500 });
  }
}
