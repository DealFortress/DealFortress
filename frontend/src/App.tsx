import { useEffect, useState } from 'react'
import './App.css'
import { Navbar } from './component/Navbar/Navbar'
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


type LoadingState = {
    status: "LOADING",
};

type ErrorState = {
    status: "ERROR",
    error: { code: string, message: string}
};

type OkState = {
    status: "OK",
    data: { notices: Notice[], products: Product[], categories: Category[]}
};

type State = LoadingState | ErrorState | OkState;

function App() {
  const [ state, setState ] = useState<State>({status: "LOADING"})

  const GetData = async () => {
    const notices = await GetNoticesFromAPI();
    const products = await GetProductsFromAPI();
     const categories = await GetCategoriesFromAPI();
    setState({data: { notices: notices, products: products, categories: categories}, status: "OK"})
  }

  useEffect(() => {
    GetData();
  }, [])

  return (
    <>
      <BrowserRouter>
      <Navbar />
          {
            {
              "LOADING":<p>Loading..</p>,
              "ERROR": <p>error</p>,
              "OK":
                  // <Main>
                  //   <Routes>
                  //     <Route path="/notices" element={ <NoticesIndex Notices={state.data}/> }/>
                  //     <Route path="/products" element={ <ProductsPage products={products} categories={categories}/>} />
                  //     {/* try to only send one sell ad */}
                  //     <Route path="/notices/:id" element={ <NoticePage Notices={notices}/> }/>
                  //     <Route path="/favourites" element={ <Favourites/> }/>
                  //     <Route path="/profile" element={ <Profile/> }/>
                  //     <Route path="/" element={ <NoticesIndex Notices={notices}/> }/>
                  //     <Route path="*" element={ <NotFound/> }/>
                  //   </Routes>
                  // </Main>
            }[state.status]
          }
        <Footer />
        </BrowserRouter>
    </>
  )
}


export default App
