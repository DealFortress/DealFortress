import { SellAdCard } from "../component/SellAd/SellAdCard"
import { SellAd } from "../types"

type Props = {
    sellAds : SellAd[]
}

export const SellAdsIndex = ( {sellAds} : Props ) => {

    const SellAdsJSX = sellAds.map(sellAd => <SellAdCard key={sellAd.id} sellAd={sellAd} />)
  return (
    <div className="">
       {SellAdsJSX}  
    </div>
  )
}
