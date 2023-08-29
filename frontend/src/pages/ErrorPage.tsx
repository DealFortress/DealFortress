import { MainContainer } from "../component/General/MainContainer";
import { StyledContainer } from "../component/General/StyledContainer";
import  notfound  from "../assets/notfound.png";


export const ErrorPage = () => {


  return (
    <MainContainer>
        <StyledContainer barText="Error" redirectLink="/">
            <>
                <img src={notfound} alt="page not found image with a cat and a dog" className="m-auto w-96 h-96 py-2.5 mt-20" />
                <p className="text-center w-full text-white text-4xl py-20">Oops! Something went silly!</p>
            </>
        </StyledContainer>
    </MainContainer>
  )
}
