import notFound from "../assets/notfound.png"

export const NotFound = () => {
    return (
      <body className="flex justify-center flex-wrap">
        <img src={notFound} alt="page not found image with a cat and a dog" className=" w-96 h-96 py-2.5 mt-20" />
        <p className="text-center w-full">404: The page you were looking for was not found.</p>
      </body>
    )
  }
