import type { DefaultSession } from "next-auth"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { z } from "zod"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials)

        if (!parsed.success) {
          console.log("[auth] Validation failed:", parsed.error)
          return null
        }

        console.log("[auth] Looking up user:", parsed.data.email)

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        console.log("[auth] User found:", !!user)

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        )

        console.log("[auth] Password match:", passwordMatch)

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
})
