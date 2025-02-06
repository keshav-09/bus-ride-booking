import { NextRequest, NextResponse } from 'next/server'
import {getFareById, updateFare,deleteFare} from '@/lib/fare'
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const location = await getFareById(params.id);
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const updatedLocation = await updateFare(params.id, data)
    return NextResponse.json(updatedLocation, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location', details: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    
    try {
        const response = await deleteFare(params.id);
        

        if (response.error) {
            return NextResponse.json({ error: response.error, details: response.details }, { status: 400 });
        }

        return NextResponse.json({ message: response.message }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete location', details: error.message }, { status: 500 });
    }
}