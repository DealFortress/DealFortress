import { SellAd } from "../../types"
import { Link } from "react-router-dom";


type Props = {
  sellAd: SellAd
}

export const SellAdCard = ( {sellAd} : Props) => {
  return (
    <Link to={`/sellads/${sellAd.id}`}> 
      <div className="card h-60 w-80 hover:bg-slate-100 ">
        <div className="card-body flex flex-col justify-between">
          <h5 className="card-title text-1xl font-semibold">{sellAd.title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{sellAd.city}</h6>
          <p className="card-text">{sellAd.description.slice(0, 200)}</p>
        </div>
      </div>
    </Link>
  )
}