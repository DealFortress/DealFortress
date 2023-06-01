import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar'
import { Footer } from './component/Footer'
import { TradePage } from './pages/TradePage'
import { GetProductsFromAPI, GetSellAdsFromAPI } from './services/DealFortressAPI'
import { Product, SellAd} from './types'
import { Main } from './component/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import { SellAdPage } from './pages/SellAdPage'
import { ProductsPage } from './pages/ProductsPage'

function App() {

  const [ sellAds, setSellAds ] = useState<SellAd[]>([]);
  const [ products, setProducts ] = useState<Product[]>([]);

  const GetData = async () => {
    setSellAds(await GetSellAdsFromAPI());
    setProducts(await GetProductsFromAPI());
  }

  console.log(products)

  useEffect(() => {
    GetData();
  }, [])

  return (
    <>
      <BrowserRouter> 
        <Navbar />
        <Main>
          <Routes>
            <Route path="/sellads" element={ <TradePage sellAds={sellAds}/> }/>
            <Route path="/products" element={ <ProductsPage products={products}/>} />
            {/* try to only send one sell ad */}
            <Route path="/sellads/:id" element={ <SellAdPage sellAds={sellAds}/> }/>

            <Route path="/" element={ <TradePage sellAds={sellAds}/> }/>
            <Route path="*" element={ <NotFound/> }/>
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </>
  )
}


export default App
