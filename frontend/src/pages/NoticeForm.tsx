import { faCity, faTruckRampBox, faCashRegister } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { Main } from "../component/Main"
import { UserInfo } from "../component/General/UserInfo"
import { Field, Form, Formik } from "formik"
import { FormikValues, FormikHelpers, FormikProps } from "formik/dist/types"
import { Notice, NoticeRequest } from "../types"
import { render } from "react-dom"

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

  const renderForm = (formikBag: FormikProps<NoticeRequest>) => (
      <Form>
            <StyledContainer barText={``} redirectLink={"/notices"}>
            <UserInfo />
            <Field 
              type="text" 
              name="title" 
              placeholder="Your title here ✒️" 
              className="text-3xl break-words mx-6 text-center bg-darkblue" 
            />
            <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto white-box-border">
                <Field 
                  component="textarea"
                  rows={10} 
                  name="description" 
                  placeholder="Write description here ✒️"  
                  className="break-words w-full bg-darkblue"
                />
            </div>
            <div className="flex justify-between">
                <ul className="font-start">
                  <li>
                    <FontAwesomeIcon icon={faCity} />
                    <Field 
                      type="text" 
                      name="city" 
                      placeholder="Your city" 
                    />
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faTruckRampBox}/>
                    <Field 
                      className="bg-darkblue" 
                      type="text" 
                      name="deliveryMethod" 
                      placeholder="Delivery method" 
                      component="select"
                    >
                      <option value="swish">Pick up</option>
                      <option value="cash">Mail</option>
                      <option value="banktransfer">Hand delivered</option>
                    </Field>
                  </li>
                </ul>
                <ul className="text-end">
                  <li>
                    <FontAwesomeIcon icon={faCashRegister}/>
                    <Field 
                      className="bg-darkblue" 
                      type="text" 
                      name="payment" 
                      placeholder="Payment" 
                      component="select"
                    >
                    <option value="swish">Swish</option>
                    <option value="cash">Cash</option>
                    <option value="banktransfer">Bank transfer</option>
                    </Field>
                  </li>
                </ul>
            </div>
            <button 
              type="submit"
              className="rounded white-box-border"
            >
              Submit
            </button>
            </StyledContainer>
        </Form>
  )

  return (
    <Main>
      <Formik
        initialValues={initialValues}
        onSubmit={ (values, actions: FormikHelpers<NoticeRequest>) => {
          actions.setSubmitting(false);
          handleSubmit(values)
        }}
      >
        {renderForm}
      </Formik>

  </Main>
  )
}
