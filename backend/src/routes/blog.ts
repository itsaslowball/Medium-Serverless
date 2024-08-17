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
        const url = c.req.url;
        if (url.includes('allblogs')) { 
                await next();
        }
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
                ...body,
                authorId: c.get('userId')
        }
        const post = await prisma.post.create({ data })

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

        const total = await prisma.post.count({
                where: {
                        published: true
                }
        });

        const blogs = await prisma.post.findMany({
                where: {
                        published: true
                },
                orderBy: {
                        createdAt: sort === 'asc' ? 'asc' : 'desc'
                },
                skip,
                take: pageSize
        }
        );

        const newBlogs = blogs.map((blog) => {
                let { content } = blog;
                let words = content.split(' ');
                if (words.length < 3) {
                        return blog;
                }
                content = words.slice(0, 3).join(' ') + '...';
                return { ...blog, content }
        })

        console.log(newBlogs);

        const res = {
                totalPage: Math.ceil(total / pageSize),
                pageNumber,
                pageSize,
        }

        return c.json({ blogs: newBlogs, pagination: res });
});

blogRouter.get('/myblogs', async (c) => {
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
                },
                orderBy: {
                        createdAt: sort === 'asc' ? 'asc' : 'desc'
                },
                skip,
                take: pageSize
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
        const userId = c.get('userId')
        const body = await c.req.json();

        console.log(body);

        const { success } = updateBlogInput.safeParse(body);
        if (!success) {
                c.status(400);
                return c.json({ message: 'Invalid post body' })
        }

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

        const data = {
                ...body,
                updatedAt: new Date()
        }

        const post = await prisma.post.update({
                where: {
                        id
                },
                data: data
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
