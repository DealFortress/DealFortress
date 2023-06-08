import { Link } from "react-router-dom"
import { ProductSearch } from "../Product/ProductSearch"

type Props = {
    filterBySearch: (input: string) => void
}

export const ToggleNavbar = ( { filterBySearch} : Props) => {

    const forumFlag = false;

    return (
        <div className='flex justify-between container mx-auto gap-8'>
                <div className='flex gap-4'>
                    <ul>
                    <li className='text-xl'><Link to="/">Market</Link></li>
                    <li><Link to="/">All</Link></li>
                    <li><Link to="/">Selling</Link></li>
                    <li><Link to="/">Buying</Link></li>
                    <li><Link to="/">Trading</Link></li>
                    </ul>
                    { forumFlag &&
                        <ul>
                        <li className='text-xl'><Link to="/">Forum</Link></li>
                        <li><Link to="/">All</Link></li>
                        </ul>
                    }
                </div>
                <ProductSearch filterBySearch={filterBySearch} />
        </div>
  )
}
