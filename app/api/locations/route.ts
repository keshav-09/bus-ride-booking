import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'; // Import Prisma client
import { addLocation } from '@/lib/location';
import { getAllLocations } from '@/lib/location';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const location = await addLocation(data)
    return NextResponse.json({ location }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add fare', details: error.message },
      { status: 500 }
    )
  }
}


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); 

  try {
    const { locations, total } = await getAllLocations({ page, limit });

    return NextResponse.json({ locations, total }, { status: 200 }); // Include both locations and total
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}


