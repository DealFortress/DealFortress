import { ProductCard } from "../component/TradePage/ProductCard"
import { SellAd } from "../types"

type Props = {
  sellAd: SellAd
}

export const SellAdPage = ( {sellAd} : Props) => {

  const ProductsJSX = sellAd.products.map( product => <ProductCard product={product} />)

  return (
    <div>
      {ProductsJSX}
    </div>
  )
}
