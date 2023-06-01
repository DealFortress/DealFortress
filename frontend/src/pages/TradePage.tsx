import { Main } from "../component/Main"
import { SellAdCard } from "../component/TradePage/SellAdCard"
import { SellAd } from "../types"

type Props = {
    SellAds : SellAd[]
}

export const TradePage = ( {SellAds} : Props ) => {

    const SellAdsJSX = SellAds.map(sellAd => <SellAdCard sellAd={sellAd} />)
  return (
    <div className="flex justify-evenly flex-wrap w-full gap-8 ">
       {SellAdsJSX}  
    </div>
  )
}
