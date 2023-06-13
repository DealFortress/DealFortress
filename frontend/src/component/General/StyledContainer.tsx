import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

type Props = {
    barText: string,
    redirectLink: string,
    children: React.ReactNode
}

export const StyledContainer = ( {barText, redirectLink, children} : Props) => {
  return (
    <section className="bg-darkblue relative rounded-lg p-6 pt-20 flex flex-col justify-between gap-12 white-box-border">
      <div className="border border-b-2 absolute w-full mx-auto top-0 left-0 flex items-center justify-between gap-2 px-2 py-2 text-1xl">
          <p className="text-xl">{barText}</p>
          <span className="grow flex flex-col gap-2 mx-1 my-auto" ><hr /><hr /><hr /></span>
          <Link to={redirectLink} className="white-box-border rounded hover:bg-blue"><FontAwesomeIcon className="text-end px-1.5" icon={faXmark} /></Link>
      </div>
      {children}
    </section>
  )
}
