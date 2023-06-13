import { faCity, faTruckRampBox, faCashRegister } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { Main } from "../component/Main"
import { UserInfo } from "../component/General/UserInfo"
import { Field, Form, Formik } from "formik"
import { FormikValues, FormikHelpers, FormikProps } from "formik/dist/types"
import { Notice, NoticeRequest } from "../types"
import { render } from "react-dom"
import { CustomSelect } from "../component/Form/CustomSelect"

export const NoticeForm = () => {

    const handleSubmit = (values: NoticeRequest) => {
        console.log(values);
    }

  const initialValues: NoticeRequest = {
    title: "",
    description: "",
    city: "",
    payment: "",
    deliveryMethod: ""
  };

  const paymentOptions = [
    { value: 'swish', label: 'Swish' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank transfer', label: 'Bank transfer' }
  ]

  const deliveryOptions = [
    { value: 'pick up', label: 'Pick up' },
    { value: 'hand delivered', label: 'Hand delivered' },
    { value: 'package', label: 'package' }
  ]




  const renderForm = () => (
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
                        className="bg-darkblue"
                      type="text"
                      name="city"
                      placeholder="Your city ✒️"
                    />
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faTruckRampBox}/>
                    <CustomSelect selectOptions={deliveryOptions} isMulti={true} name={"deliveryMethod"}/>
                  </li>
                </ul>
                <ul className="text-end">
                  <li>
                   <CustomSelect selectOptions={paymentOptions} isMulti={true} name={"payment"}/>
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
