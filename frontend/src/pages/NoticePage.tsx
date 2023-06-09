import { useParams } from "react-router-dom"
import { Notice } from "../types"
import { NoticeProductCard } from "../component/Notice/NoticeProductCard"
import { Main } from "../component/Main"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCashRegister, faCity, faMoneyBill, faTractor, faTruckRampBox } from "@fortawesome/free-solid-svg-icons"

type Props = {
  notices: Notice[]
}

export const NoticePage = ( {notices} : Props) => {

  

  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const notice = notices.find(notice => notice.id === +id!);

  // const JSX = notice?.products.map(product => product.price).reduce( (a, b) => a + b);

  const ProductsJSX = notice?.products.map( product => <NoticeProductCard key={product.id} product={product} />)
  return (
    <Main>
      <div className="flex flex-col gap-4">
        <section className="bg-darkblue rounded-lg p-6 flex flex-col justify-between gap-12">
            <h2 className="text-3xl break-words mt-12 mx-6 text-center">{notice?.title}</h2>
          <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto border border-2 drop-shadow-[10px_10px_rgba(0,0,0,0.25)]">
            <p className="break-words">{notice?.description}</p> I like this cartoony look tbh, so something like this? 
          </div> 
          <div className="">
            <ul className="font-start">
              
              <li><FontAwesomeIcon icon={faCity} /> {notice?.city}</li>
              <li><FontAwesomeIcon icon={faTruckRampBox}/> {notice?.deliveryMethod}</li>
            </ul>
            <ul className="text-end">
              <li className="font-bold">{}SEK</li>
              <li>{notice?.payment} <FontAwesomeIcon icon={faCashRegister}/></li>
            </ul>
          </div>
        </section>
        <section className="bg-darkblue p-4 flex flex-col rounded gap-4">
          <h3>Items</h3> 
          {/* {ProductsJSX} */} 
        </section>
      </div>
    </Main>
  )
}
