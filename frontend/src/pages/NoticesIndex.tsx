import { Main } from "../component/Main"
import { NoticeCard } from "../component/Notice/NoticeCard"
import { Notice } from "../types"
import logo from '../assets/logo.png'

type Props = {
    notices : Notice[]
}

export const NoticesIndex = ( {notices} : Props ) => {

    const NoticesJSX = notices.map(notice => <NoticeCard key={notice.id} notice={notice} />)
  return (
    <>
        <div className="w-full h-[30vh] bg-blue flex justify-center items-center">
            <img src={logo} alt="deal fortress logo" className="logo-l "/>
        </div>
        <Main>
        <header>
            <h2 className="text-2xl">Latest posts</h2>
        </header>
        <section>
            {NoticesJSX}
        </section>
        </Main>
    </>
  )
}
