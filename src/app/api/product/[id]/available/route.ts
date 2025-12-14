'use server'
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import dayjs from 'dayjs';


type AvailableHoursResponse = string[];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string | any }> }
) {
  const url = new URL(req.url);
  const dateString = url.searchParams.get('date');
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
  }

  if (!dateString) {
    return NextResponse.json({ message: 'Date parameter is required.' }, { status: 400 });
  }

  const parsedDate = dayjs(dateString, 'YYYY-MM-DD', true);
  if (!parsedDate.isValid()) {
    return NextResponse.json({ message: 'Invalid date format. Expected YYYY-MM-DD.' }, { status: 400 });
  }


  const startOfDay = parsedDate.startOf('day').toDate();
  const endOfDay = parsedDate.endOf('day').toDate();


  try {
    const slots = await db.availableSlot.findMany({
      where: {
        productId: id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        hour: true,
      },
      orderBy: {
        hour: 'asc',
      }
    });

    const availableHours: AvailableHoursResponse = slots.map(s => s.hour);

    return NextResponse.json(availableHours, { status: 200 });

  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
