import './App.css'
import {BrowserRouter , Route, Routes} from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes> 
      </BrowserRouter>
    </>
  )
}

export default App
