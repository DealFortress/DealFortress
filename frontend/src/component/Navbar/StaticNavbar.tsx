import { faBars, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

type Props = {
    navbarToggle: boolean
    setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const userPictureFlag = false;
const toggleNavbarFlag = false;

export const StaticNavbar = ( { setNavbarToggle, navbarToggle} : Props) => {
  return (
    <div className='container flex justify-between items-center mx-auto gap-4'>
        {toggleNavbarFlag &&
            <button className='text-3xl px-1' onClick={() => setNavbarToggle(!navbarToggle)}><FontAwesomeIcon icon={faBars} /></button>
        }
        <Link to="/">
            <div className='flex gap-2 items-center flex-1'>
                <img src={logo} alt="deal fortress logo" className="logo-s "/>
                <p className='text-xl medieval-font drop-shadow-md'>DealFortress</p>
            </div>
        </Link>
        {userPictureFlag ?
            <div className="flex gap-4 items-center flex-1 justify-end">
            <Link className='text-3xl' to="/profile"><FontAwesomeIcon icon={faCircle} /></Link>
            </div> 
            :
            <div></div>
        }
    </div>
  )
}
