import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar'
import { Footer } from './component/Footer'
import { GetCategoriesFromAPI, GetProductsFromAPI, GetSellAdsFromAPI } from './services/DealFortressAPI'
import { Category, Product, SellAd} from './types'
import { Main } from './component/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import { SellAdPage } from './pages/SellAdPage'
import { ProductsPage } from './pages/ProductsPage'
import { SellAdsIndex } from './pages/SellAdsIndex'

function App() {

  const [ sellAds, setSellAds ] = useState<SellAd[]>([]);
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ categories, setCategories ] = useState<Category[]>([]);

  const GetData = async () => {
    setSellAds(await GetSellAdsFromAPI());
    setProducts(await GetProductsFromAPI());
    setCategories(await GetCategoriesFromAPI());
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
            <Route path="/sellads" element={ <SellAdsIndex sellAds={sellAds}/> }/>
            <Route path="/products" element={ <ProductsPage products={products} categories={categories}/>} />
            {/* try to only send one sell ad */}
            <Route path="/sellads/:id" element={ <SellAdPage sellAds={sellAds}/> }/>

            <Route path="/" element={ <SellAdsIndex sellAds={sellAds}/> }/>
            <Route path="*" element={ <NotFound/> }/>
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </>
  )
}


export default App
