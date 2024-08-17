import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import { Home } from './pages/Home'
import { Element } from './components/Element'
import { useSelector } from 'react-redux'
import { checkLogIn } from './app/authSlice'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { MyBlogs } from './pages/MyBlogs'


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogIn());
  }, [dispatch]);
  
  dispatch(checkLogIn());


  const isLoggedIn = useSelector((state: any) =>
    state.auth.isLoggedIn
  ); 


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Element>
              <Home />
            </Element>
          } />
          
          {isLoggedIn &&
            <>
            <Route path='/blog/:id' element={<Element>
              <Blog />
            </Element>} />
            <Route path='/myblogs' element={<Element>
              <MyBlogs />
            </Element>} />
            <Route path='/write' element={<Element>
              <h1>Write</h1>
            </Element>} />
            <Route path="*" element={<Navigate to='/' replace />} />
          </>
          }
          {!isLoggedIn && <>
            <Route path="/signin" element={
              <Signin />
            } />
            <Route path="/signup" element={
              <Signup />
            } />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
