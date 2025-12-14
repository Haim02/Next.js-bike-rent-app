import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import dayjs from 'dayjs';

export async function GET(req: Request, { params }: { params: { id: string | any } }) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  const { id } = params;
  const productId = id;

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ message: 'Date parameter is required.' }, { status: 400 });
  }

  const parsedDate = dayjs(date, 'YYYY-MM-DD', true);
  if (!parsedDate.isValid()) {
    return NextResponse.json({ message: 'Invalid date format. Expected YYYY-MM-DD.' }, { status: 400 });
  }

  try {
    const messages = await db.message.findMany({
      where: {
        productId: productId,
        date: date,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
      select: { hours: true },
    });

    const bookedHours: string[] = [];
    const uniqueBookedHours = new Set<string>();

    messages.forEach(msg => {
      msg.hours.forEach(hour => uniqueBookedHours.add(hour));
    });

    return NextResponse.json(Array.from(uniqueBookedHours));

  } catch (error) {
    console.error("Error fetching booked hours:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}