import { SellAd } from "../../types"
import { Link } from "react-router-dom";


type Props = {
  sellAd: SellAd
}

export const SellAdCard = ( {sellAd} : Props) => {
  return (
    <Link to="/"> 
      <div className="card flex-basis flex-grow-1 max-w-sm hover:bg-slate-100">
        <div className="card-body">
          <h5 className="card-title">{sellAd.title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{sellAd.city}</h6>
          <p className="card-text">{sellAd.description}</p>
        </div>
      </div>
    </Link>
  )
}
