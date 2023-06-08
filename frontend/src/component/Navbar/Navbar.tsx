import { useState } from 'react'
import { StaticNavbar } from './StaticNavbar'
import { ToggleNavbar } from './ToggleNavbar'

export const Navbar = () => {

  const [ navbarToggle, setNavbarToggle ] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>("");



  const filterBySearch = (input : string) => {
    setSearchFilter(input);
  }


  return (
    <div className="w-screen py-4 top-0 relative bg-darkblue text-white gap-4 rounded-b-xl flex flex-col">
        <StaticNavbar setNavbarToggle={setNavbarToggle} navbarToggle={navbarToggle} />
        {
          navbarToggle && (
            <>
                <hr className='w-[90%] mx-auto'/>
                < ToggleNavbar filterBySearch={filterBySearch}/>
            </>
          )
        }
    </div>
  )
}
