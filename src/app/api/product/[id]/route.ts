'use server'
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (req: Request,{ params }: { params: Promise<{ id: string | any }> }) => {
  const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
    }

    try {
      const product = await db.product.findUnique({
        where: { id },
      });

          if (!product) {
            return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
          }
          return NextResponse.json(product);
        } catch (error) {
          return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
        }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string | any }> }
  ) {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
    }

    try {
      const body = await req.json();
      const { type, title, description, pricePerDay, pricePerHour, model, hasHelmet, batteryWatts } = body


      const updatedProduct = await db.product.update({
        where: { id },
        data: {
            type,
            title,
            description,
            pricePerDay,
            pricePerHour,
            model,
            hasHelmet,
            batteryWatts,
            updateAt: new Date() as Date,
        },
      });

      return NextResponse.json(updatedProduct);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'מוצר לא נמצא' }, { status: 404 });
      }

      return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
    }
  }

  export async function DELETE(req: Request, { params }: { params: Promise<{ id: string | any }> }) {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה מוצר' }, { status: 400 });
    }

    try {
      await db.product.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'המוצר נמחק בהצלחה' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'המוצר לא נמצא' }, { status: 404 });
      }

      return NextResponse.json({ error: 'שגיאה במחיקה' }, { status: 500 });
    }
  }


