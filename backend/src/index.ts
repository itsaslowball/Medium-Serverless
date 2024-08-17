import { Hono } from 'hono'
import { cors } from 'hono/cors'
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

app.use(
  '/*',
  cors({
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type', "authorization"],
    allowMethods: ['POST', 'GET', 'OPTIONS',"PUT", "DELETE"],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);


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
