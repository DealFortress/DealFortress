import { faCity, faTruckRampBox, faCashRegister } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { Main } from "../component/Main"
import { UserInfo } from "../component/General/UserInfo"
import { Field, Formik } from "formik"
import { FormikValues, FormikHelpers } from "formik/dist/types"
import { NoticeRequest } from "../types"

export const NoticeForm = () => {

    const handleSubmit = (values: NoticeRequest) => {
        return null
    }

  const initialValues: NoticeRequest = {
    title: "",
    description: "",
    city: "",
    payment: "",
    deliveryMethod: ""
  };

  return (
    <Main>
      <Formik
        initialValues={initialValues}
        onSubmit={ values => {
            handleSubmit(values)
        }}
      >
        <form action="">
            <StyledContainer barText={``} redirectLink={"/notices"}>
            <UserInfo />
            <Field type="text" name="title" placeholder="Title" className="text-3xl break-words mx-6 text-center" />
            <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto white-box-border">
                <textarea rows={30} name="description" placeholder="Description"  className="break-words"/>
            </div>
            <div className="flex justify-between">
                <ul className="font-start">
                <li><FontAwesomeIcon icon={faCity} /><Field type="text" name="city" placeholder="City" /></li>
                <li><FontAwesomeIcon icon={faTruckRampBox}/><Field type="text" name="deliveryMethod" placeholder="Delivery method" /></li>
                </ul>
                <ul className="text-end">
                <li><FontAwesomeIcon icon={faCashRegister}/><Field type="text" name="payment" placeholder="Payment" /></li>
                </ul>
            </div>

            </StyledContainer>
        </form>
      </Formik>

  </Main>
  )
}
