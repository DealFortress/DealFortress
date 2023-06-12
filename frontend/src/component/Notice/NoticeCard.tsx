import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notice } from "../../types"
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { convertMinutesToClosestTimeValue} from "../../services/helperFunction";


type Props = {
  notice: Notice
}

export const NoticeCard = ( {notice} : Props) => {

  const minutesSinceCreation = ( new Date().getTime() - new Date(notice.createdAt).getTime()) / 1000 / 60;

  return (
    <Link to={`/Notices/${notice.id}`} className="flex flex-col justify-between bg-blue rounded my-2 p-3 gap-4 white-box-border">
      <p className="font-semibold text-lg break-words">{notice.title}</p>
      <div className="flex gap-12 justify-between">
        <p>{notice.city}</p>
        <p>{convertMinutesToClosestTimeValue(minutesSinceCreation)} ago</p>
        {/* <Link className='text-xl' to="/favourites" ><FontAwesomeIcon icon={faHeart} /></Link> */}
      </div>
    </Link>

  )
}
