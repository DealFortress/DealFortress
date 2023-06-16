import underConstruction from "../assets/underconstruction.png";
import { MainContainer } from "../component/General/MainContainer";

export const ToBeDeveloped = () => {
    return (
      <MainContainer>
        <img src={underConstruction} alt="under construction image" className=" w-96 h-96 py-2.5" />
        <p className="text-center w-full">501: Page under construction please tread carefully!</p>
      </MainContainer>
    )
  }
