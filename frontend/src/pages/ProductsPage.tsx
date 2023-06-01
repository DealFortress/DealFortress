import { ProductCard } from "../component/TradePage/ProductCard"
import { Product } from "../types"


type Props = {
    products: Product[]
}

export const ProductsPage = ( {products} : Props) => {

    const productsJSX = products.map( product => <ProductCard key={product.id} product={product} />)

  return (
    <div className="flex flex-wrap gap-8 ">
        {productsJSX}
    </div>
  )
}
