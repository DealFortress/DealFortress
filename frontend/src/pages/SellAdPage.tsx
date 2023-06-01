
type Props = {
  sellAd: SellAd
}

export const SellAdPage = ( {sellAd} : Props) => {

  const ProductsJSX = sellAd.product.map( product => <ProductCard product={product} />)

  return (
    <div>

    </div>
  )
}
