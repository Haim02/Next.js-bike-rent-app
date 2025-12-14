'use server'

import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Session = {
  user: {
    name: string,
    email: string,
    image?: undefined,
    id: string
  }
};

export const GET = async (req: Request, { params }: { params: { id: string | any } }) => {
        const { id } = params;

        if (!id) {
          return NextResponse.json({ error: 'חסר מזהה משתמש' }, { status: 400 });
        }

        try {
          const user = await db.user.findUnique({
            where: { id },
          });
          if (!user) {
            return NextResponse.json({ error: 'המשתמש לא נמצא' }, { status: 404 });
          }

          return NextResponse.json(user);
        } catch (error) {
          console.error('שגיאה בקבלת משתמש:', error);
          return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
        }
      }



export const PATCH = async (req: Request, { params }: { params: { id: string | any } }) => {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
    }


    const session = await getServerSession(authOptions) as Session;
    if (id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await req.json();

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
