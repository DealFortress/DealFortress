import { Link } from "react-router-dom"
import { Product } from "../../types"

type Props = {
    product: Product
}

export const ProductCard = ({product} : Props) => {
  return (
    <Link to={`../sellads/${product.sellAdId}`}> 
    <div className="card flex-basis flex-grow w-96">
        <img src="https://cdn.arstechnica.net/wp-content/uploads/2022/12/IMG_0725.jpeg" className="card-img-top h-40 w-full object-cover" alt="product image"/>
        <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">price: {product.price} receipt: {product.receipt} warranty: {product.warranty} category:{product.categoryId} condition:{product.condition}</p>
            <p>City: {product.sellAdCity}</p>
            <p>DeliveryMethod: {product.sellAdDeliveryMethod}</p>
            <p>Payment: {product.sellAdPayment}</p>
        </div>
    </div>
    </ Link>
  )
}
