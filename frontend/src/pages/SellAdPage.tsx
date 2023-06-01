import { useParams } from "react-router-dom"
import { SellAd } from "../types"
import { SellAdProductCard } from "../component/SellAd/SellAdProductCard"

type Props = {
  sellAds: SellAd[]
}

export const SellAdPage = ( {sellAds} : Props) => {

  const { id } = useParams();
  const sellAd = sellAds.find(sellAd => sellAd.id === +id!);

  const ProductsJSX = sellAd?.products.map( product => <SellAdProductCard key={product.id} product={product} />)
  return (
    <div className="grid grid-cols-[3fr_6fr] gap-5">
      <aside className="bg-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl mb-5">{sellAd?.title}</h2>
          <p>{sellAd?.description}</p>
        </div>
        <div className="">
          <ul className="font-start">
            <li>{sellAd?.city}</li>
            <li>{sellAd?.deliveryMethod}</li> 
          </ul>
          <ul className="text-end">
            <li className="font-bold">{sellAd?.products.map(product => product.price).reduce( (a, b) => a + b)}SEK</li>
            <li>{sellAd?.payment}</li>
          </ul>
        </div>
      </aside>
      <section className="bg-white p-4 flex flex-col rounded gap-4">
        {ProductsJSX}
      </section>
    </div>
  )
}
