import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { verify } from 'hono/jwt'
import { updateBlogInput, createBlogInput } from "@priyans34/medium-common";

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
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');


        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if (!success) {
                c.status(400);
                return c.json({ message: 'Invalid post body' })
        }

        const post = await prisma.post.create({
                data: {
                        title: body.title,
                        content: body.content,
                        authorId: c.get('userId')
                }
        })

        return c.json({ id: post.id })
});



blogRouter.get('/bulk', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const blogs = await prisma.post.findMany();

        return c.json({ blogs });
});


blogRouter.get('/:id', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const id = c.req.param('id')

        const post = await prisma.post.findFirst({
                where: {
                        id: id
                }
        })
        return c.json({ post })
});

blogRouter.put('/:id', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const id = c.req.param('id')

        const body = await c.req.json();
        const { success } = updateBlogInput.safeParse(body);
        if (!success) {
                c.status(400);
                return c.json({ message: 'Invalid post body' })
        }

        const post = await prisma.post.update({
                where: {
                        id
                },
                data: {
                        title: body.title,
                        content: body.content
                }
        })

        return c.json({ id: post.id })
});

