import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faHeart, faCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ProductSearch } from './Product/ProductSearch'

export const Navbar = () => {

  const [ searchInputToggle, setSearchInputToggle ] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filterBySearch = (input : string) => {
    setSearchFilter(input);
  }
  
  return (
    <div className="w-screen py-4 top-0 relative bg-[rgb(42,42,42)] text-white">
        <div className='container flex justify-between items-center mx-auto gap-8'>
            <Link to="/" className='flex gap-4 items-center'>
              <img src={logo} alt="deal fortress logo" className="logo-s"/>
              <p className=''>DealFortress</p> 
            </Link>
            <div className="flex gap-4 items-center">
                {! searchInputToggle ?
                  <button onClick={() => setSearchInputToggle(!searchInputToggle)}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                : 
                  <ProductSearch filterBySearch={filterBySearch} />
                }
                <Link to="/favourites" ><FontAwesomeIcon icon={faHeart} /></Link>
                <Link to="/profile"><FontAwesomeIcon icon={faCircle} /></Link>
            </div>
        </div>
    </div>
  )
}
