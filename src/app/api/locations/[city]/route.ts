import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: Promise<{ city: string | any }> } ) {
  const { city } = await params;

  const res = await fetch(
    `https://data.gov.il/api/3/action/datastore_search?resource_id=a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3&q=${encodeURIComponent(city)}&limit=2000`
  );
  const json = await res.json();
  return NextResponse.json(json);
}
