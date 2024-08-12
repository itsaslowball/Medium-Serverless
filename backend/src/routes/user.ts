import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const userRouter = new Hono<{
        Bindings: {
                DATABASE_URL: string,
                JWT_SECRET: string,
        }
}
>();

userRouter.post('signup', async (c) => {
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
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
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());


        const body = await c.req.json();
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