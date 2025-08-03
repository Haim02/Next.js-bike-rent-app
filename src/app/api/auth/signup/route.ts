'use server'

import { db } from "@/lib/db"
import { hashPassword } from "@/utils/incrypt"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {

    try {
        const body = await req.json()
        const { email, name, phone, password } = body
        const existingUserEmail = await db.user.findUnique({
            where: { email: email }
        })
        if(existingUserEmail) {
            return NextResponse.json({user: null, message: 'user email aleredy exist'}, {status: 409})
        }

        const hashedPassword = await hashPassword(password)
        const newUser = await db.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword
            }
        })
        return NextResponse.json({user: newUser, message: 'user created'}, {status: 201})

    } catch (error) {
        return NextResponse.json({message: 'Somting went wrong'}, {status: 500})
    }
}