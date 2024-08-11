import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('api/v1/signup', (c) => {
  return c.json({ message: 'Signup' })
})

app.post('api/v1/signin', (c) => {
  return c.json({ message: 'Signin' })
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
