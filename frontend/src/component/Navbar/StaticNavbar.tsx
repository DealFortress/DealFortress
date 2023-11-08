import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth0 } from '@auth0/auth0-react'

type Props = {
    navbarToggle: boolean
    setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const toggleNavbarFlag = false;

export const StaticNavbar = ( { setNavbarToggle, navbarToggle} : Props) => {
    
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const authenticationBlock = () => {

      return isAuthenticated ?
      <>
        <button onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>Logout</button>
        <Link className='text-3xl' to="/profile"><img src={user?.picture} alt="avatar" className='avatar rounded-full w-10' /></Link> 
      </> 
      :
      <button onClick={() => loginWithRedirect()}>Login</button>
    }


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
        <div className="flex gap-4 items-center flex-1 justify-end">
            {authenticationBlock()}
        </div>
    </div>
  )
}
