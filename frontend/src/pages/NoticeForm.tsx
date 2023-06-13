import { faCity, faTruckRampBox, faCashRegister } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { Main } from "../component/Main"

export const NoticeForm = () => {
  return (
    <Main>
    <StyledContainer barText={``} redirectLink={"/notices"}>

      <div className="self-center text-center flex flex-col gap-2">
        <p>User name</p>
        <img className="rounded-full w-[35%] m-auto" src="https://picsum.photos/512" alt="profile picture" />
        <p>reputation</p>
      </div>
      <h2 className="text-3xl break-words mx-6 text-center"></h2>
      <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto white-box-border">
        <p className="break-words"></p>
      </div>
      <div className="flex justify-between">
        <ul className="font-start">
          <li><FontAwesomeIcon icon={faCity} /> </li>
          <li><FontAwesomeIcon icon={faTruckRampBox}/> </li>
        </ul>
        <ul className="text-end">
          <li className="font-bold">{}SEK</li>
          <li><FontAwesomeIcon icon={faCashRegister}/></li>
        </ul>
      </div>

    </StyledContainer>

    <section className="df-container-style">
      <h3>Items</h3>
      {/* {ProductsJSX} */}
    </section>

  </Main>
  )
}
