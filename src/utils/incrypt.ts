import { hash, compare } from "bcryptjs"

export const hashPassword = async(password: string) => {
    const hashedPassword = await hash(password, 12)
    return hashedPassword
}


export const comparePassword = async(password: string, userPassword: string) => {
    const passwordMatch = await compare(password, userPassword)
    return passwordMatch
}