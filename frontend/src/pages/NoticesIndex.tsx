import { NoticeCard } from "../component/Notice/NoticeCard"
import { Notice } from "../types"

type Props = {
    notices : Notice[]
}

export const NoticesIndex = ( {notices} : Props ) => {

    const NoticesJSX = notices.map(notice => <NoticeCard key={notice.id} Notice={notice} />)
  return (
    <div className="">
       {NoticesJSX}
    </div>
  )
}
