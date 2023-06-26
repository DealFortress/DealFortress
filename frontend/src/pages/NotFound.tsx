import notFound from "../assets/notfound.png"
import { MainContainer } from "../component/General/MainContainer"
import { StyledContainer } from "../component/General/StyledContainer"

export const NotFound = () => {
    return (
      <MainContainer>
        <StyledContainer barText="Not found" redirectLink="/">
            <>
              <img src={notFound} alt="page not found image with a cat and a dog" className="mx-auto w-96 h-96 py-2.5 mt-5" />
              <p className="text-center w-full text-4xl mb-6">The page you were looking does not exist.</p>
            </>
        </StyledContainer>
      </MainContainer>
    )
  }
