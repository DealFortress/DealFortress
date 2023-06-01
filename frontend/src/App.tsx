import { useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar'
import { Footer } from './component/Footer'
import { TradePage } from './pages/TradePage'

function App() {


  return (
    <>
      <Navbar />
        <TradePage />
      <Footer />
    </>
  )
}

export default App
