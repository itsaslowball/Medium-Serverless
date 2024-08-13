import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { verify } from 'hono/jwt'
import { updateBlogInput, createBlogInput } from "@priyans34/medium-common";
import { HTTPException } from "hono/http-exception";

export const blogRouter = new Hono<{
        Bindings: {
                DATABASE_URL: string,
                JWT_SECRET: string,
        },
        Variables: {
                userId: string,
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
        const data = {
                title: body.title,
                content: body.content,
                authorId: c.get('userId'),
                published : body.published ? body.published : false
        }

        const post = await prisma.post.create({data})

        return c.json({ id: post.id })
});

blogRouter.get('/allblogs', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');

        //add pagination
        const { pg, sort } = c.req.query();
        const pageNumber = pg ? parseInt(pg) : 1;
        const pageSize = 2;
        const skip = (pageNumber - 1) * pageSize;       

        const blogs = await prisma.post.findMany({
                where: {
                        published: true
                },
                orderBy: {
                        createdAt: sort === 'asc' ? 'asc' : 'desc'
                },
                skip,
                take:pageSize
        }
        );

        return c.json({ blogs });
});

blogRouter.get('/drafts', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const userId = c.get('userId')

        const { pg, sort } = c.req.query();
        const pageNumber = pg ? parseInt(pg) : 1;
        const pageSize = 2;
        const skip = (pageNumber - 1) * pageSize; 

        const blogs = await prisma.post.findMany({
                where: {
                        authorId: userId,
                        published: false
                },
                orderBy: {
                        createdAt: sort === 'asc' ? 'asc' : 'desc'
                },
                skip,
                take:pageSize
        }
        );
        return c.json({ blogs });
})

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

blogRouter.delete('/:id', async (c) => {
        // @ts-ignore
        const prisma: PrismaClient = c.get('prisma');
        const id = c.req.param('id')
        const userId = c.get('userId')
        //check if the user is the author of the post
        try {
                const foundBlog = await prisma.post.findFirst({
                        where: {
                                id,
                                authorId: userId
                        }
                })
                if (!foundBlog) {
                        throw new HTTPException(403, { message: 'User is not the creator of the blog' })
                }
        }
        catch (e) {
                console.log(e);
                throw new HTTPException(403, { message: 'User is not the creator of the blog' })
        }

        const post = await prisma.post.delete({
                where: {
                        id,
                        authorId: userId
                }
        })

        return c.json({ id: post.id })
});
