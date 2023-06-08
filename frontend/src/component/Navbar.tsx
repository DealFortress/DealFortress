import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faHeart } from '@fortawesome/free-solid-svg-icons'

export const Navbar = () => {
  return (
    <div className="w-screen py-4 top-0 relative bg-[rgb(42,42,42)] text-white">
        <div className='flex justify-around'>
            <img src={logo} alt="deal fortress logo" className="logo-s"/>
            <p>Deal Fortress</p>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <FontAwesomeIcon icon={faHeart} />
        </div>
        <div className="container flex justify-between">
            <Link to="/Notices">Notices</Link>
            <Link to="/products">products</Link>
        </div>
    </div>
  )
}
