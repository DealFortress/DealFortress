import { Notice } from "../../types"
import { Link } from "react-router-dom";


type Props = {
  Notice: Notice
}

export const NoticeCard = ( {Notice} : Props) => {
  return (
    <Link to={`/Notices/${Notice.id}`}> 
      <div className="card h-60 w-80 hover:bg-slate-100 ">
        <div className="card-body flex flex-col justify-between">
          <h5 className="card-title text-1xl font-semibold">{Notice.title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{Notice.city}</h6>
          <p className="card-text">{Notice.description.slice(0, 200)}</p>
        </div>
      </div>
    </Link>
  )
}