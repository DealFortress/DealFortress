import { faCity, faTruckRampBox, faCashRegister} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StyledContainer } from "../component/General/StyledContainer"
import { MainContainer } from "../component/General/MainContainer"
import { UserInfo } from "../component/General/UserInfo"
import { Field, Form, Formik } from "formik"
import { FormikHelpers} from "formik/dist/types"
import { Notice, NoticeRequest } from "../types"
import { CustomSelect } from "../component/Form/CustomSelect"
import { useNavigate } from "react-router-dom"
import { PostNoticeMutation } from "../services/DealFortressQueries"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth0 } from "@auth0/auth0-react"


export const NoticeForm = () => {

  const {mutate : postNotice, isLoading, isError} = PostNoticeMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();


  const createNavigationUrl = (notice: Notice) => `/notices/${notice.id}`;

  const handleSubmit = async (request: NoticeRequest) => {
    const accessToken = await getAccessTokenSilently();
    postNotice({request, accessToken}, {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["notices"], {exact: true})
        const navigationUrl = createNavigationUrl(data);
        navigate(navigationUrl);
      }
    });
  }

  const initialValues: NoticeRequest = {
    title: "",
    description: "",
    city: "",
    payments: [""],
    deliveryMethods: [""]
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

  const userFeaturesFlag = false;

  const renderForm = () => (
      <Form>
            <StyledContainer barText={`Create notice`} redirectLink={"/notices"}>
            {userFeaturesFlag && <UserInfo /> }
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
              <div className="flex justify-between flex-col gap-4">
                  <ul className="font-start flex flex-col gap-4">
                    <li className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faCity} className="w-6"/>
                      <Field
                        className="bg-darkblue w-full h-9"
                        type="text"
                        name="city"
                        placeholder="Your city ✒️"
                      />
                    </li>
                    <li className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faTruckRampBox} className="w-6"/>
                      <CustomSelect selectOptions={deliveryOptions} isMulti={true} name={"deliveryMethods"} placeholder="Select delivery method(s)"/>
                    </li>
                    <li className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faCashRegister} className="w-6"/>
                    <CustomSelect selectOptions={paymentOptions} isMulti={true} name={"payments"} placeholder="Select payment method(s)"/>
                    </li>
                  </ul>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {isError && 
                  <p className="text-center bg-red rounded  white-box-border">
                    Something went wrong.
                  </p>
                }
                <button
                  type="submit"
                  className="rounded white-box-border disabled:opacity-40 w-full py-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Publish"}
                </button>
              </div>


            </StyledContainer>
        </Form>
  )

  return (
    <MainContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={ (values, actions: FormikHelpers<NoticeRequest>) => {
          actions.setSubmitting(false);
          handleSubmit(values);
        }}
      >
        {renderForm}
      </Formik>
  </MainContainer>
  )
}
