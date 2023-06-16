import { MainContainer } from "../component/General/MainContainer"
import { NoticeCard } from "../component/Notice/NoticeCard"
import { Notice } from "../types"
import logo from '../assets/logo.png'
import { convertDateToMinutes } from "../services/helperFunctions"

type Props = {
    notices : Notice[]
}

export const NoticesIndex = ( {notices} : Props ) => {

    const NoticesJSX = notices.sort((a, b) => convertDateToMinutes(a.createdAt) - convertDateToMinutes(b.createdAt) ).map(notice => <NoticeCard key={notice.id} notice={notice} />)
  return (
    <>
        <div className="w-full h-[30vh] bg-blue flex justify-center items-center ">
            <img src={logo} alt="deal fortress logo" className="logo-l "/>
        </div>
        <MainContainer>
        <header>
            <h2 className="text-2xl medieval-font">Latest posts</h2>
        </header>
        <section className="flex flex-col gap-3">
            {NoticesJSX}
        </section>
        </MainContainer>
    </>
  )
}
