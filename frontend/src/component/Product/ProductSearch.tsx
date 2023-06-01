import { useState } from "react"

type Props = {
    filterBySearch: (input: string) => void
}

export const ProductSearch = ({ filterBySearch} : Props) => {


  return (
    <form action="">
        <input type="text" onChange={e => filterBySearch(e.target.value)} placeholder="Product Name"/>
    </form>
  )
}
