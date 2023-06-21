import { MainContainer } from "../component/General/MainContainer"
import { NoticeCard } from "../component/Notice/NoticeCard"
import { Notice } from "../types"
import logo from '../assets/logo.png'
import { convertDateToMinutes } from "../services/helperFunctions"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"

type Props = {
    notices : Notice[]
}

export const NoticesIndex = ( {notices} : Props ) => {

    const NoticesJSX = notices.sort((a, b) => convertDateToMinutes(b.createdAt) - convertDateToMinutes(a.createdAt) ).map(notice => <NoticeCard key={notice.id} notice={notice} />)
  return (
    <>
        <div className="w-full h-[30vh] bg-blue flex justify-center items-center ">
            <img src={logo} alt="deal fortress logo" className="logo-l "/>
        </div>
        <MainContainer>
        <header>
            <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl medieval-font">Latest posts</h2>
                <Link to="/createnotice" className="text-3xl"><FontAwesomeIcon icon={faPlusCircle}/></Link>
            </div>
            <p className="text-end">Create Notice</p>
        </header>
        <section className="flex flex-col gap-3">
            {NoticesJSX}
        </section>
        </MainContainer>
    </>
  )
}
