import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faHeart, faCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ProductSearch } from './Product/ProductSearch'

export const Navbar = () => {

  const [ navbarToggle, setNavbarToggle ] = useState<boolean>(false)
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
                <button onClick={() => setNavbarToggle(!navbarToggle)}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <Link to="/favourites" ><FontAwesomeIcon icon={faHeart} /></Link>
                <Link to="/profile"><FontAwesomeIcon icon={faCircle} /></Link>
            </div>
        </div>
        {
          navbarToggle && (
            <div className='flex justify-between container mx-auto gap-8'>
              <div className='flex gap-4'>
                <ul>
                  <li className='text-xl'><Link to="/">Market</Link></li>
                  <li><Link to="/">All</Link></li>
                  <li><Link to="/">Selling</Link></li>
                  <li><Link to="/">Buying</Link></li>
                  <li><Link to="/">Trading</Link></li>
                </ul>
                <ul>
                  <li className='text-xl'><Link to="/">Forum</Link></li>
                  <li><Link to="/">All</Link></li>
                </ul>
              </div>
              <ProductSearch filterBySearch={filterBySearch} />
            </div>
          )
        }
    </div>
  )
}
