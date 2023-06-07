import { useState } from "react"
import { ProductFilter } from "../component/Product/ProductFilter"
import { ProductCard } from "../component/Product/ProductCard"
import { Category, Product, ProductFilterType } from "../types"
import { ProductSearch } from "../component/Product/ProductSearch"


type Props = {
    products: Product[],
    categories: Category[]
}

export const ProductsPage = ( {products, categories} : Props) => {
    const [filter, setFilter] = useState<ProductFilterType>({categoryFilter:"All", cityFilter:"All"} as ProductFilterType);
    const [searchFilter, setSearchFilter] = useState<string>("");


    const filterProduct = (product: Product) => {
      return (product.categoryName === filter.categoryFilter || filter.categoryFilter === "All") 
        && (product.NoticeCity === filter.cityFilter ||filter.cityFilter === "All")
    }

    const filterBySearch = (input : string) => {
      setSearchFilter(input);
    }

    const productsJSX = products
                          .filter(product => filterProduct(product))
                          .filter(product => product.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()) )
                          .map( product => <ProductCard key={product.id} product={product} />)

    const handleFilter = (filterData: string, type: string) => {
        const updatedFilter = { ...filter };
        switch (type) {
          case "category":
            updatedFilter.categoryFilter = filterData;
            break;
          default:
            break;
        }
        setFilter(updatedFilter);
    }

  return (
    <>
      <div className="products-page__filters">
        <ProductSearch filterBySearch={filterBySearch} />
        <ProductFilter categories={categories} handleFilter={handleFilter} filterType="category"/>
        {/* <Filter handleFilter={handleFilter} filterType="city"/> */}


      </div>
      <div className="flex flex-wrap gap-8 justify-between">
          {productsJSX}
      </div>
    </>
  )
}
