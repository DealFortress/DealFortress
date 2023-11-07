import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


type Props = {
    filterBySearch: (input: string) => void
}

export const SearchBar = ({ filterBySearch} : Props) => {


  return (
    <form action="" className="w-full text-black max-w-xl">
        <div className="rounded-full w-full bg-white flex items-center relative">
          <input type="text" className="rounded-full w-full ps-2 py-1" onChange={e => filterBySearch(e.target.value)} placeholder="Search"/>
          <button className="absolute end-0 hover:bg-[lightgray] rounded-full px-2 py-1">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </button>
        </div>
    </form>
  )
}
