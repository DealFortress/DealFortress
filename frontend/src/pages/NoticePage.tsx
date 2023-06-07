import { useParams } from "react-router-dom"
import { Notice } from "../types"
import { NoticeProductCard } from "../component/Notice/NoticeProductCard"

type Props = {
  Notices: Notice[]
}

export const NoticePage = ( {Notices} : Props) => {

  const { id } = useParams();
  const Notice = Notices.find(Notice => Notice.id === +id!);

  const ProductsJSX = Notice?.products.map( product => <NoticeProductCard key={product.id} product={product} />)
  return (
    <div className="grid grid-cols-[3fr_6fr] gap-5">
      <aside className="bg-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl mb-5">{Notice?.title}</h2>
          <p>{Notice?.description}</p>
        </div>
        <div className="">
          <ul className="font-start">
            <li>{Notice?.city}</li>
            <li>{Notice?.deliveryMethod}</li> 
          </ul>
          <ul className="text-end">
            <li className="font-bold">{Notice?.products.map(product => product.price).reduce( (a, b) => a + b)}SEK</li>
            <li>{Notice?.payment}</li>
          </ul>
        </div>
      </aside>
      <section className="bg-white p-4 flex flex-col rounded gap-4">
        {ProductsJSX}
      </section>
    </div>
  )
}
