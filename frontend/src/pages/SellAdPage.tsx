import { useParams } from "react-router-dom"
import { ProductCard } from "../component/Product/ProductCard"
import { SellAd } from "../types"

type Props = {
  sellAds: SellAd[]
}

export const SellAdPage = ( {sellAds} : Props) => {

  const { id } = useParams();
  const sellAd = sellAds.find(sellAd => sellAd.id === +id!);

  const ProductsJSX = sellAd?.products.map( product => <ProductCard key={product.id} product={product} />)
  return (
    <div className="flex flex-wrap gap-8">
      {ProductsJSX}
    </div>
  )
}
