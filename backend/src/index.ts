import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}
>()


app.use('api/v1/blog/*', async (c, next) => {
  let token = c.req.header('authorization') || "";
  token = token.split(' ')[1];
  if (!token) {
    c.status(401)
    return c.json({ message: 'Unauthorized' })
  }

  const secret = c.env?.JWT_SECRET
  try {
    const response = await verify(token, secret)
    if (response.id) {
      next();
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

app.get('/', (c) => {

  return c.text('Hello Hono!')
})

app.post('api/v1/signup', async (c) => {
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
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  }
  const secret = c.env?.JWT_SECRET
  const token = await sign(payload, secret)
  return c.json({ jwt: token })
})

app.post('api/v1/signin', async (c) => {
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
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  }
  const secret = c.env?.JWT_SECRET
  const token = await sign(payload, secret)
  return c.json({ jwt: token })
})

app.post('api/v1/blog', (c) => {
  return c.json({ message: 'Create blog' })
});

app.put('api/v1/blog', (c) => {
  return c.json({ message: 'Update blog' })
});

app.get('api/v1/blog/:id', (c) => {
  return c.json({ message: 'Get blog by id' })
});

export default app
