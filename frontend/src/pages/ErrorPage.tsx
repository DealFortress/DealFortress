import { useQuery } from "@tanstack/react-query";
import { MainContainer } from "../component/General/MainContainer";
import { StyledContainer } from "../component/General/StyledContainer";
import { NoticesQuery } from "../services/DealFortressQueries";


export const ErrorPage = () => {

    const {status : noticeStatus} = NoticesQuery();

  return (
    <MainContainer>
        <StyledContainer barText="Error" redirectLink="/">
            <>
                {/* <img src={notFound} alt="page not found image with a cat and a dog" className=" w-96 h-96 py-2.5 mt-20" /> */}
                {noticeStatus == "error" && (
                    <p className="text-center w-full text-white text-4xl py-20">Oops! Something went silly!</p>
                )}
            </>
        </StyledContainer>
    </MainContainer>
  )
}
