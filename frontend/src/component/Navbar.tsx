import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className="w-screen py-4 top-0 relative bg-[rgb(42,42,42)] text-white">
      <div className="container flex justify-between">
        <Link to="/Notices">Notices</Link>
        <Link to="/products">products</Link>
      </div>
    </div>
  )
}
