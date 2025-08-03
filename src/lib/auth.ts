import { NextAuthOptions } from 'next-auth'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from './db';
import { comparePassword } from '@/utils/incrypt';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60
    },
    pages: {
        signIn: '/login',
        signOut: '/signout'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "email", type: "text", placeholder: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                return null
            }

            const existingUser = await db.user.findUnique({
                where: {email: credentials.email}
            })

            if(!existingUser) {
                return null
            }

            const isPasswordMatch = await comparePassword(credentials.password, existingUser.password)

            if (!isPasswordMatch) {
                    return null
                }

            return {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
            }
          }
        })
      ],
      callbacks: {
          async jwt({ token, user }) {
            if(user) {
                return {
                    ...token,
                    name: user.name
                }
            }
            return token
          },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    name: token.name,
                    id: token.sub
                }
            }
          },
      }
}