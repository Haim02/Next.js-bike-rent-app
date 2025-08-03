'use server'

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import dayjs from 'dayjs'; // לטיפול ואימות תאריכים
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

// הגדרת טיפוס עבור גוף הבקשה
interface CreateMessageRequestBody {
  productId: string;
  fromUserId: string;
  toUserId: string;
  date: string;    // תאריך בפורמט YYYY-MM-DD
  hours: string[]; // כעת זהו מערך של מחרוזות
  content: string;
}

// הגדרת טיפוס עבור תגובת הצלחה
type SuccessResponse = {
  message: string;
  bookingId: string; // רק ID אחד כי זו רשומה אחת
};

// הגדרת טיפוס עבור תגובת שגיאה
type ErrorResponse = {
  message: string;
};



export const GET = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
           if (!session || !session.user?.id) {
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