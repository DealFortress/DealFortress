import { Product } from "../../types"

type Props = {
    product: Product
}

export const ProductCard = ({product} : Props) => {
  return (
    <div className="card">
        <img src="https://cdn.arstechnica.net/wp-content/uploads/2022/12/IMG_0725.jpeg" className="card-img-top" alt="product image"/>
        <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">price: {product.price} receipt: {product.receipt} warranty: {product.warranty} category:{product.categoryId} condition:{product.Condition}</p>
        </div>
    </div>
  )
}
