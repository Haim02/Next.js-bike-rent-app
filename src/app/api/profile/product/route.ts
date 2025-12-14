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
    try {
      const session = await getServerSession(authOptions) as Session;
      if (!session || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const product = await db.product.findUnique({
        where: { authorId: session.user?.id },
      });
          if (!product) {
            return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
          }

          return NextResponse.json(product);
        } catch (error) {
          return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
        }
}


export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string | any }> }) => {

  try {
    const session = await getServerSession(authOptions) as Session;
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await req.json();

    const updatedProduct = await db.product.update({
      where: { authorId: session.user?.id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}



export const DELETE = async (req: Request) => {

  try {
    const session = await getServerSession(authOptions) as Session;
    if (!session || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.product.delete({
      where: { authorId: session.user?.id },
    });

    return NextResponse.json({ message: 'המוצר נמחק בהצלחה' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'המוצר לא נמצא' }, { status: 404 });
    }

    console.error('שגיאה במחיקה:', error);
    return NextResponse.json({ error: 'שגיאה כללית בשרת' }, { status: 500 });
  }
}