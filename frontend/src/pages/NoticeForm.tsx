import { faCity, faTruckRampBox, faCashRegister } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { Main } from "../component/Main"
import { UserInfo } from "../component/General/UserInfo"
import { Formik } from "formik"
import { FormikValues, FormikHelpers } from "formik/dist/types"

export const NoticeForm = () => {
  const initialValues = {
    title: "",
    description: "",
    city: "",
    payment: "",
    deliveryMethod: ""
  }
  return (
    <Main>
      <Formik 
        initialValues={initialValues} 
        onSubmit={(values, {setSubmitting}) => {
          
        }}
      >
        <StyledContainer barText={``} redirectLink={"/notices"}>

          <UserInfo />
          <input className="text-3xl break-words mx-6 text-center" />
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
      </Formik>

  </Main>
  )
}
