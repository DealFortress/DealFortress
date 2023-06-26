import underConstruction from "../assets/underconstruction.png";
import { MainContainer } from "../component/General/MainContainer";
import { StyledContainer } from "../component/General/StyledContainer";

export const UnderConstruction = () => {
    return (
        <MainContainer>
        <StyledContainer barText="Not found" redirectLink="/">
            <>
              <img src={underConstruction} alt="under construction image" className=" w-96 h-96 py-2.5 mt-5 mx-auto" />
              <p className="text-center w-full text-4xl mb-6">Page under construction please tread carefully!</p>
            </>
        </StyledContainer>
      </MainContainer>
    )
  }
