import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}
  >()

 app.use('/*', async (c, next) => { 
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  // @ts-ignore
  c.set('prisma', prisma)
  await next();
});

app.route('api/v1/user', userRouter);
app.route('api/v1/blog', blogRouter);

app.get('/', (c) => {
  return c.text('Hello From Medium Server!! Ohh Its Serverless!!')
})

export default app
