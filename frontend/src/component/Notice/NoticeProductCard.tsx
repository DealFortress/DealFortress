import { Product } from "../../types"
import { useState } from "react"

type Props = {
    product: Product
}

export const NoticeProductCard = ({product} : Props) => {
    const [isToggled, setIsToggled] = useState<boolean>(false);

  return (
    <div className=" bg-white rounded cursor-pointer flex items-start p-2 border-b-2" onClick={() => setIsToggled(!isToggled)}>
        <img src="https://cdn.arstechnica.net/wp-content/uploads/2022/12/IMG_0725.jpeg" className="card-img-top w-40 h-full object-cover px-2" alt="product image"/>
        <div className="flex w-full justify-between">
            <h5 className="p-0 m-0">{product.name}</h5>
            <p className="">{product.price}SEK</p>
            {isToggled && (
                <p> receipt: {product.receipt} warranty: {product.warranty} category:{product.categoryId} condition:{product.condition} </p>
            )}
        </div>
    </div>
  )
}
