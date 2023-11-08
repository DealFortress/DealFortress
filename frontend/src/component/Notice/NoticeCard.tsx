import { Notice } from "../../types"
import { Link } from "react-router-dom";
import { minutesBetweenTodayAndDate, convertMinutesToClosestTimeValue} from "../../services/helperFunctions";


type Props = {
  notice: Notice
}

export const NoticeCard = ( {notice} : Props) => {

  const minutesSinceCreation = minutesBetweenTodayAndDate(notice.createdAt);

  return (
    <Link to={`/Notices/${notice.id}`} className="flex flex-col justify-between bg-blue rounded my-2 p-3 gap-4 white-box-border">
      <p className="font-semibold text-lg break-words">{notice.title}</p>
      <div className="flex gap-12 justify-between">
        <p>{notice.city}</p>
        <p>{convertMinutesToClosestTimeValue(minutesSinceCreation)}</p>
      </div>
    </Link>

  )
}
