import { Link, useParams } from "react-router-dom"
import { Notice } from "../types"
import { Main } from "../component/Main"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faCashRegister, faCity, faCross, faMoneyBill, faTractor, faTruckRampBox, faXmark } from "@fortawesome/free-solid-svg-icons"

type Props = {
  notices: Notice[]
}

export const NoticePage = ( {notices} : Props) => {



  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const notice = notices.find(notice => notice.id === +id!);

  // const JSX = notice?.products.map(product => product.price).reduce( (a, b) => a + b);

//   const ProductsJSX = notice?.products.map( product => <NoticeProductCard key={product.id} product={product} />)
  return (
    <Main>
      <div className="flex flex-col gap-4">
        <section className="bg-darkblue relative rounded-lg p-6 flex flex-col justify-between gap-12 white-box-border">
            {/* make it a component */}
            <div className="border border-b-2 absolute w-full mx-auto top-0 left-0 flex justify-between gap-2 px-2 text-2xl">
                <p>{notice?.id}</p>
                <span className="w-full flex flex-col gap-1 mx-1 my-auto" ><hr /><hr /><hr /></span>
                <Link to="/" className="white-box-border"><FontAwesomeIcon className="text-end " icon={faXmark} /></Link>
            </div>
            <h2 className="text-3xl break-words mt-12 mx-6 text-center">{notice?.title}</h2>
          <div className="w-full p-4 bg-darkblue text-white rounded-xl mx-auto white-box-border">
            <p className="break-words">{notice?.description}</p>
          </div>
          <div className="flex justify-between">
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
        <section className="bg-darkblue p-4 flex flex-col rounded gap-4 white-box-border">
          <h3>Items</h3>
          {/* {ProductsJSX} */}
        </section>
      </div>
    </Main>
  )
}
