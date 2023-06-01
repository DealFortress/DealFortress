import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className="bg-white w-screen py-4 top-0 relative">
      <div className="container flex justify-between">
        <Link to="/sellads">sellads</Link>
        <Link to="/products">products</Link>
      </div>
    </div>
  )
}
