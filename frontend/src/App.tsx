import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar'
import { Footer } from './component/Footer'
import { GetCategoriesFromAPI, GetProductsFromAPI, GetNoticesFromAPI } from './services/DealFortressAPI'
import { Category, Product, Notice} from './types'
import { Main } from './component/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import { NoticePage } from './pages/NoticePage'
import { ProductsPage } from './pages/ProductsPage'
import { NoticesIndex } from './pages/NoticesIndex'
import { Favourites } from './pages/Favourites'
import { Profile } from './pages/Profile'

function App() {

  const [ Notices, setNotices ] = useState<Notice[]>([]);
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ categories, setCategories ] = useState<Category[]>([]);

  const GetData = async () => {
    setNotices(await GetNoticesFromAPI());
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
            <Route path="/notices" element={ <NoticesIndex Notices={Notices}/> }/>
            <Route path="/products" element={ <ProductsPage products={products} categories={categories}/>} />
            {/* try to only send one sell ad */}
            <Route path="/notices/:id" element={ <NoticePage Notices={Notices}/> }/>
            <Route path="/favourites" element={ <Favourites/> }/>
            <Route path="/profile" element={ <Profile/> }/>
            <Route path="/" element={ <NoticesIndex Notices={Notices}/> }/>
            <Route path="*" element={ <NotFound/> }/>
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </>
  )
}


export default App
