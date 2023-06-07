import { Link } from "react-router-dom"
import { Product } from "../../types"

type Props = {
    product: Product
}
// https://cdn.arstechnica.net/wp-content/uploads/2022/12/IMG_0725.jpeg
export const ProductCard = ({product} : Props) => {

  // console.log(product.images[0].url);

  return (
    <Link to={`../Notices/${product.NoticeId}`}>
    <div className="card flex-basis flex-grow w-96">
        <img src={product.images[0].url} className="card-img-top h-40 w-full object-cover" alt="product image"/>
        <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">price: {product.price} receipt: {product.receipt} warranty: {product.warranty} category:{product.categoryId} condition:{product.condition}</p>
            <p>City: {product.NoticeCity}</p>
            <p>DeliveryMethod: {product.NoticeDeliveryMethod}</p>
            <p>Payment: {product.NoticePayment}</p>
        </div>
    </div>
    </ Link>
  )
}
