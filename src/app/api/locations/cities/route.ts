import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    `https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=2000`
  );
  const json = await res.json();
  return NextResponse.json(json);
}
