import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


type Props = {
    filterBySearch: (input: string) => void
}

export const ProductSearch = ({ filterBySearch} : Props) => {


  return (
    <form action="" className="w-full text-black">
        <div className="rounded-full ps-2 w-full bg-white flex px-2 items-center">
          <input type="text" className="rounded-full w-full" onChange={e => filterBySearch(e.target.value)} placeholder="Search"/>
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
    </form>
  )
}
