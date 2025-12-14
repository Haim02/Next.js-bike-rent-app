'use server'

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export async function PATCH(req: Request, { params }: { params: { id: string | any } }) {
  const { id } = params;
    const { status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
    }

    try {
      await db.message.update({
        where: {id: id},
        data: {
            status: status
        }
    })

    return NextResponse.json({ message: 'המוצר עודכן בהצלחה' });


    } catch (error: any) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'המוצר לא נמצא' }, { status: 404 });
      }

      return NextResponse.json({ error: 'שגיאה במחיקה' }, { status: 500 });
    }
  }
