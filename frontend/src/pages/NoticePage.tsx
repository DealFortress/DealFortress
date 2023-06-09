import { useParams } from "react-router-dom"
import { Notice } from "../types"
import { NoticeProductCard } from "../component/Notice/NoticeProductCard"

type Props = {
  notices: Notice[]
}

export const NoticePage = ( {notices} : Props) => {

  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const notice = notices.find(notice => notice.id === +id!);

  const ProductsJSX = notice?.products.map( product => <NoticeProductCard key={product.id} product={product} />)
  return (
    <div className="grid grid-cols-[3fr_6fr] gap-5">
      <aside className="bg-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl mb-5">{notice?.title}</h2>
          <p>{notice?.description}</p>
        </div>
        <div className="">
          <ul className="font-start">
            <li>{notice?.city}</li>
            <li>{notice?.deliveryMethod}</li>
          </ul>
          <ul className="text-end">
            <li className="font-bold">{notice?.products.map(product => product.price).reduce( (a, b) => a + b)}SEK</li>
            <li>{notice?.payment}</li>
          </ul>
        </div>
      </aside>
      <section className="bg-white p-4 flex flex-col rounded gap-4">
        {ProductsJSX}
      </section>
    </div>
  )
}
