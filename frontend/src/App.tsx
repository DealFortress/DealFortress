import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar'
import { Footer } from './component/Footer'
import { TradePage } from './pages/TradePage'
import { GetSellAdsFromAPI } from './services/DealFortressAPI'
import { SellAd } from './types'
import { Main } from './component/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'

function App() {

  const [ sellAds, setSellAds ] = useState<SellAd[]>([]);

  const GetData = async () => {
    setSellAds(await GetSellAdsFromAPI());
  }

  useEffect(() => {
    GetData();
  }, [])

  return (
    <>
      <Navbar />
      <Main>
        <BrowserRouter> 
          <Routes>
            <Route path="/sellads" element={ <TradePage SellAds={sellAds}/> }/>
            <Route path="/sellads/:sellAdId" element={ <TradePage SellAds={sellAds}/> }/>
            <Route path="/" element={ <TradePage SellAds={sellAds}/> }/>
            <Route path="*" element={ <NotFound/> }/>
          </Routes>
        </BrowserRouter>
      </Main>
      <Footer />
    </>
  )
}


export default App
