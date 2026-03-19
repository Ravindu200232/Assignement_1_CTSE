import { AiOutlineLogin } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa"; // Login icon

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // If there's a token, fetch user data from localStorage
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  return (
    <header className="w-full h-[80px] shadow-xl flex justify-between items-center px-4 md:px-8 bg-gradient-to-r from-gray-900 to-primary relative">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="logo"
          className="w-28  object-cover"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-secondary">
        <Link to="/" className="text-[18px] hover:text-gray-400">
          Home
        </Link>
        <Link to="/contact" className="text-[18px] hover:text-gray-400">
          Contact
        </Link>
        <Link to="/restaurant" className="text-[18px] hover:text-gray-400">
          Restaurants
        </Link>
        <Link to="/item" className="text-[18px] hover:text-gray-400">
          Items
        </Link>
      </div>

      {/* Icons and User Info */}
      <div className="flex items-center space-x-4 text-white">
        {/* Display user info if logged in */}
        {user ? (
          <div className="flex items-center space-x-2">
            <span className="text-[16px] text-lg hidden md:inline">
              {user.firstName}
            </span>
            <Link to="/profile">
              <img
                src={user.image || "/default-profile.png"}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border border-white"
              />
            </Link>
          </div>
        ) : (
          // Show login icon/link if no user is logged in
          <Link to="/login" className="text-[30px] hover:text-gray-400">
            <AiOutlineLogin />
          </Link>
        )}

        <Link to="/cart">
          <AiOutlineShoppingCart className="text-[30px] hover:text-gray-400" />
        </Link>

        {/* Mobile Menu Button */}
        <HiMenu
          className="text-[30px] md:hidden cursor-pointer hover:text-gray-400"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-primary shadow-md flex flex-col items-center py-4 space-y-4 text-white">
          <Link to="/" className="text-[18px] hover:text-gray-400">
            Home
          </Link>
          <Link to="/contact" className="text-[18px] hover:text-gray-400">
            Contact
          </Link>
          <Link to="/gallery" className="text-[18px] hover:text-gray-400">
            Gallery
          </Link>
          <Link to="/item" className="text-[18px] hover:text-gray-400">
            Items
          </Link>
        </div>
      )}
    </header>
  );
}
