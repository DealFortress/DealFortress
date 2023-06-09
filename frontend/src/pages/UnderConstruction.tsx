import underConstruction from "../assets/underconstruction.png";

export const ToBeDeveloped = () => {
    return (
      <body className="flex justify-center flex-wrap">
        <img src={underConstruction} alt="under construction image" className=" w-96 h-96 py-2.5" />
        <p className="text-center w-full">501: Page under construction please tread carefully!</p>
      </body>
    )
  }
