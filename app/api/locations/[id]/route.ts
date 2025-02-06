import { NextRequest, NextResponse } from 'next/server'
import { getLocationById, updateLocation, deleteLocation } from '@/lib/location'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const location = await getLocationById(params.id);
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location', details: error.message }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteLocation(params.id);
    return NextResponse.json({ message: 'Location deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}