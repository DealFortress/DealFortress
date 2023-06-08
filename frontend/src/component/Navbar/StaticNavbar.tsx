import { faCircle, faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

type Props = {
    navbarToggle: boolean
    setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export const StaticNavbar = ( { setNavbarToggle, navbarToggle} : Props) => {
  return (
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
  )
}
