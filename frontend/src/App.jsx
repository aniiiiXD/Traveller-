import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' 

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />}  />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App