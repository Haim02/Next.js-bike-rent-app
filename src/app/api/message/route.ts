'use server'

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

interface CreateMessageRequestBody {
  productId: string;
  fromUserId: string;
  toUserId: string;
  date: string;
  hours: string[];
  content: string;
}

type SuccessResponse = {
  message: string;
  bookingId: string;
};

type ErrorResponse = {
  message: string;
};


export async function POST(req: Request) {
    let body: CreateMessageRequestBody;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body as JSON:", error);
      return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
    }

    const { productId, toUserId, date, hours, content } = body;

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      console.log("Unauthorized attempt to POST /api/messages: No session or user ID.");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!productId || !toUserId || !date || !hours || !content) {
      console.log("Missing required fields in request body:", { productId, toUserId, date, hours, content });
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (!Array.isArray(hours) || hours.length === 0) {
      console.log("Hours not an array or empty:", hours);
      return NextResponse.json({ message: 'Hours must be a non-empty array.' }, { status: 400 });
    }

    const parsedDate = dayjs(date, 'YYYY-MM-DD', true);
    if (!parsedDate.isValid()) {
      console.log("Invalid date format:", date);
      return NextResponse.json({ message: 'Invalid date format. Expected YYYY-MM-DD.' }, { status: 400 });
    }
    if (!hours.every(h => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(h))) {
      console.log("Invalid hour format in hours array:", hours);
      return NextResponse.json({ message: 'Invalid hour format in array. Expected HH:00 for all hours.' }, { status: 400 });
    }

    try {
      const existingMessagesForDate = await db.message.findMany({
        where: {
          productId: productId,
          date: date,
          status: {
            in: ['PENDING', 'APPROVED'],
          },
        },
        select: { hours: true },
      });

      const bookedHours = new Set<string>();
      existingMessagesForDate.forEach(msg => {
        msg.hours.forEach(hour => bookedHours.add(hour));
      });
      console.log("Booked hours from existing messages for this product/date:", Array.from(bookedHours));
      console.log("Requested hours by user:", hours);


      const alreadyBookedHoursInRequest: string[] = [];

      for (const requestedHour of hours) {
        if (bookedHours.has(requestedHour)) {
          alreadyBookedHoursInRequest.push(requestedHour);
        }
      }

      if (alreadyBookedHoursInRequest.length > 0) {
        console.warn('Conflict: The following hours are already booked or pending:', alreadyBookedHoursInRequest);
        return NextResponse.json(
          { message: `The following hours are already booked or pending: ${alreadyBookedHoursInRequest.join(', ')}` },
          { status: 409 }
        );
      }

      const newMessage = await db.message.create({
        data: {
          productId: productId,
          fromUserId: session.user?.id,
          toUserId: toUserId,
          date: date,
          hours: hours,
          content: content,
          status: 'PENDING',
        },
      });

      console.log('Successfully created new message:', newMessage);

      return NextResponse.json(
        {
          message: 'Booking request sent successfully!',
          bookingId: newMessage.id,
        },
        { status: 201 }
      );

    } catch (error) {
      console.error("Caught error during booking process:", error);
      if (error instanceof Error) {
          return NextResponse.json({ message: `Internal Server Error: ${error.message}` }, { status: 500 });
      }
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }


export const GET = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
           if (!session || !session.user?.id) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
           }

           const messages = await db.message.findMany({
            where: { fromUserId: session.user?.id },
            include: {
                product: true,
              },
          });
        return NextResponse.json(messages, {status: 200})

    } catch (error) {
        return NextResponse.json({message: 'Somting went wrong'}, {status: 500})
    }
}