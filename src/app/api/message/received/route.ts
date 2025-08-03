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

type Session = {
  user: {
    name: string,
    email: string,
    image?: undefined,
    id: string
  }
};



export const GET = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions) as Session;
           if (!session || !session.user?.id ) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
           }

           const messages = await db.message.findMany({
            where: { toUserId: session.user?.id },
            include: {
                product: true,
              },
          });
        return NextResponse.json(messages, {status: 200})

    } catch (error) {
        return NextResponse.json({message: 'Somting went wrong'}, {status: 500})
    }
}