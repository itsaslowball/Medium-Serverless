import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { sign } from 'hono/jwt'
import {  signInInput, signUpInput } from "@priyans34/medium-common";


export const userRouter = new Hono<{
        Bindings: {
                DATABASE_URL: string,
                JWT_SECRET: string,
        }
}
>();



userRouter.post('signup', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const body = await c.req.json();
        const { success } = signUpInput.safeParse(body);
        if (!success) { 
                c.status(400);
                return c.json({ message: 'Invalid request body' })
        }


        const user = await prisma.user.create({
                data: body
        })

        if (!user) {
                return c.json({ message: "Internal Server Error" });
        }

        const payload = {
                id: user.id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 5 minutes
        }
        const secret = c.env?.JWT_SECRET
        const token = await sign(payload, secret)
        return c.json({ jwt: token })
})

userRouter.post('signin', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const body = await c.req.json();
        const { success } = signInInput.safeParse(body);
        if (!success) { 
                c.status(400);
                return c.json({ message: 'Invalid request body' })
        }
        const user = await prisma.user.findUnique({
                where: {
                        email: body.email,
                        password: body.password
                },
        })

        if (!user) {
                c.status(403);
                return c.json({ message: 'Invalid email or password' })
        }

        const payload = {
                id: user.id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 5 minutes
        }
        const secret = c.env?.JWT_SECRET
        const token = await sign(payload, secret)
        return c.json({ jwt: token })
})