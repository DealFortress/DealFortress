import { useParams } from "react-router-dom"
import { Notice } from "../types"
import { MainContainer } from "../component/General/MainContainer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCashRegister, faCity, faTruckRampBox } from "@fortawesome/free-solid-svg-icons"
import { StyledContainer } from "../component/General/StyledContainer"


type Props = {
  notices: Notice[]
}

export const NoticePage = ( {notices} : Props) => {

  const { id } = useParams();

  const notice = notices.find(notice => notice.id === +id!);
  
  const userFeaturesFlag = false;

  return (
    <MainContainer>
      <StyledContainer barText={`Notice ${notice?.id}`} redirectLink={"/notices"}>
        {userFeaturesFlag &&
          <div className="self-center text-center flex flex-col gap-2">
            
            <p>User name</p>
            <img className="rounded-full w-[35%] m-auto" src="https://picsum.photos/512" alt="profile picture" />
            <p>reputation</p>
          </div>
        }
        <h2 className="text-3xl break-words mx-6 text-center">{notice?.title}</h2>
        <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto white-box-border">
          <p className="break-words">{notice?.description}</p>
        </div>
        <div className="flex justify-between">
          <ul className="font-start">
            <li><FontAwesomeIcon icon={faCity} /> {notice?.city}</li>
            <li><FontAwesomeIcon icon={faTruckRampBox}/> {notice?.deliveryMethods}</li>
          </ul>
          <ul className="text-end">
            <li className="font-bold">{}SEK</li>
            <li>{notice?.payments} <FontAwesomeIcon icon={faCashRegister}/></li>
          </ul>
        </div>

      </StyledContainer>

    </MainContainer>
  )
}
