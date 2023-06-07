import { NoticeCard } from "../component/Notice/NoticeCard"
import { Notice } from "../types"

type Props = {
    Notices : Notice[]
}

export const NoticesIndex = ( {Notices} : Props ) => {

    const NoticesJSX = Notices.map(Notice => <NoticeCard key={Notice.id} Notice={Notice} />)
  return (
    <div className="">
       {NoticesJSX}  
    </div>
  )
}
