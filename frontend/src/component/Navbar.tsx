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
    <div className="w-screen py-4 top-0 relative bg-darkblue text-white">
        <div className='container flex justify-between items-center mx-auto gap-2'>
            <Link to="/">
                <div className='flex gap-2 items-center flex-1'>
                    <img src={logo} alt="deal fortress logo" className="logo-s "/>
                    <p>DealFortress</p>
                </div>
            </Link>
            <div className="flex gap-4 items-center flex-1 justify-end">
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
