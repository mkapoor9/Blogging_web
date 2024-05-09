import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Blog } from './pages/Blog'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/blog' element={<Blog/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
