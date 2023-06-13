
type Props = {
children: React.ReactNode
}

export const Main = ({children} : Props) => {
  return (
    <main className="container py-4 my-5 text-white mx-auto flex flex-col gap-4">
        {children}
    </main>
  )
}
