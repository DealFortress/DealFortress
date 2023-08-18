import { useState } from 'react'
import { StaticNavbar } from './StaticNavbar'
import { ToggleNavbar } from './ToggleNavbar'

export const Navbar = () => {

  const [ navbarToggle, setNavbarToggle ] = useState<boolean>(false)
  const [ searchFilter, setSearchFilter ] = useState<string>("");



  const filterBySearch = (input : string) => {
    setSearchFilter(input);
    console.log(searchFilter);
  }

  return (
    <div className="w-screen py-4 top-0 sticky bg-darkblue text-white gap-4 rounded-b-xl flex flex-col z-10 border-b-2 ">
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
