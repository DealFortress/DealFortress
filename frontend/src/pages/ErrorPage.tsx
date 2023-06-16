import { useContext } from "react"
import { MarketContextType } from "../types";
import { MarketContext } from "../context/MarketProvider";
import { MainContainer } from "../component/General/MainContainer";
import { StyledContainer } from "../component/General/StyledContainer";


export const ErrorPage = () => {
    const { marketState } = useContext(MarketContext) as MarketContextType;

  return (
    <MainContainer>
        <StyledContainer barText="Error" redirectLink="/">
            <>
                {/* <img src={notFound} alt="page not found image with a cat and a dog" className=" w-96 h-96 py-2.5 mt-20" /> */}
                {marketState.status == "ERROR" && (
                    <p className="text-center w-full text-white text-4xl py-20">Oops! Something went silly!</p>
                )}
            </>
        </StyledContainer>
    </MainContainer>
  )
}
