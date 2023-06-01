import { Main } from "../component/Main"
import { SellAdCard } from "../component/TradePage/SellAdCard"
import { SellAd } from "../types"

type Props = {
    sellAds : SellAd[]
}

export const TradePage = ( {sellAds} : Props ) => {

    const SellAdsJSX = sellAds.map(sellAd => <SellAdCard key={sellAd.id} sellAd={sellAd} />)
  return (
    <div className="flex justify-evenly flex-wrap w-full gap-8 ">
       {SellAdsJSX}  
    </div>
  )
}
