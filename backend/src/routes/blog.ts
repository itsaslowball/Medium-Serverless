import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
        Bindings: {
                DATABASE_URL: string,
                JWT_SECRET: string,
        },
        Variables: {
                userId: string
        }
}
        >();


blogRouter.use('/*', async (c, next) => {
        let token = c.req.header('authorization') || "";
        token = token.split(' ')[1];
        if (!token) {
                c.status(401)
                return c.json({ message: 'Unauthorized' })
        }

        const secret = c.env?.JWT_SECRET
        try {
                const response = await verify(token, secret)
                if (response.id && typeof response.id === 'string') {
                        c.set('userId', response.id)
                        await next();
                }
                else {
                        c.status(403)
                        return c.json({ message: 'Unauthorized' })
                }
        }
        catch (e) {
                c.status(403)
                return c.json({ message: 'Unauthorized' })
        }

})

blogRouter.post('/', async (c) => {
        console.log("1");
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        console.log("2");


        const body = await c.req.json();

        const post = await prisma.post.create({
                data: {
                        title: body.title,
                        content: body.content,
                        authorId: c.get('userId')
                }
        })

        return c.json({ id: post.id })
});

blogRouter.put('/', async(c) => {
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();

        const post = await prisma.post.update({
                where: {
                        id: body.id
                },
                data: {
                        title: body.title,
                        content: body.content
                }
        })

        return c.json({ id: post.id })
});

blogRouter.get('/bulk', async (c) => {
        console.log("1");
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
        console.log("1");
        const blogs = await prisma.post.findMany();
        console.log("2");
        console.log("blogs", blogs);
        console.log("3");

        return c.json({ blogs });
});

blogRouter.get('/:id', async (c) => {
        const prisma = new PrismaClient({
                datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.req.param('id')

        const post = await prisma.post.findFirst({
                where: {
                        id: id
                }
        })
        return c.json({ post })
});

