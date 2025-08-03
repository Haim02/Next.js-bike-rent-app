'use server'

import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const { type, title, description, pricePerDay, pricePerHour, model, images, city, street, houseNumber, hasHelmet, batteryWatts, authorId } = body

        const product = await db.product.create({
            data: {
                type,
                title,
                description,
                pricePerDay,
                pricePerHour,
                city,
                street,
                houseNumber,
                model,
                images,
                hasHelmet,
                batteryWatts,
                authorId
            }
        })
        return NextResponse.json({product: product, message: 'product created'}, {status: 201})

    } catch (error) {
        return NextResponse.json({message: 'Somting went wrong'}, {status: 500})
    }
}

export const GET = async () => {
    const products = await db.product.findMany()

    if(!products) {
        return NextResponse.json({message: 'No products was found'}, {status: 404})
    }
    return NextResponse.json(products)
}