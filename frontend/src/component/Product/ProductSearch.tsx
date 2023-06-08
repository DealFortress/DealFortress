

type Props = {
    filterBySearch: (input: string) => void
}

export const ProductSearch = ({ filterBySearch} : Props) => {


  return (
    <form action="" className="w-full">
        <input type="text" className="w-full rounded-full ps-2" onChange={e => filterBySearch(e.target.value)} placeholder="Search"/>
    </form>
  )
}
