import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PiShoppingCartThin } from "react-icons/pi";
import { IoMdSearch } from 'react-icons/io';
import Logo from './ui/Logo';
import { UserSlicePath } from '@/redux/slice/user.slice';
import { useSelector } from 'react-redux';
import { useAuthContext } from '@/context/AuthContext';
import { setCollapse, setToggle, SidebarSlicePath } from '@/redux/slice/sidebar.slice';
import { IoIosMenu } from "react-icons/io";
import { useDispatch } from 'react-redux';

const Header = () => {
  const user = useSelector(UserSlicePath);
  const { logoutUser } = useAuthContext()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const protected_route = ['/dashboard', '/profile', '/AddProduct', '/AllProduct', '/orders', '/wishlist', '/checkout']
  const dispatch = useDispatch()
  const { isToggle, isCollapse } = useSelector(SidebarSlicePath)
  const [searchValue, setSearchValue] = useState('')

  const isHomePage = pathname === '/'

  const handleSearch = (value) => {
    setSearchValue(value)

    if (isHomePage) {
      const params = new URLSearchParams(window.location.search)
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      navigate(`/?${params.toString()}`, { replace: true })
    }
  }

  useEffect(() => {
    if (isHomePage) {
      const params = new URLSearchParams(window.location.search)
      setSearchValue(params.get('q') || '')
    } else {
      setSearchValue('')
    }
  }, [pathname, isHomePage])

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-x-4">
            {protected_route.includes(pathname) && (
              <>
                <button
                  className="text-2xl bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer rounded-xl p-2.5 hidden md:block hover:from-blue-100 hover:to-purple-100 transition-all hover:shadow-md"
                  onClick={() => dispatch(setCollapse())}
                >
                  <IoIosMenu className={`transition-transform duration-300 ${isCollapse ? 'rotate-90' : ''} text-blue-600`} />
                </button>
                <button
                  className="text-2xl bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer rounded-xl p-2.5 block md:hidden hover:from-blue-100 hover:to-purple-100 transition-all hover:shadow-md"
                  onClick={() => dispatch(setToggle())}
                >
                  <IoIosMenu className="text-blue-600" />
                </button>
              </>
            )}
            <Logo />
          </div>

          {/* Search Bar */}
          {isHomePage && (
            <div className="flex-1 max-w-3xl mx-8 hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center px-6 py-3">
                    <IoMdSearch className="text-2xl text-gray-400 mr-4" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-x-6">
            <nav className="hidden md:flex items-center gap-x-6 text-base">
              {user && (
                <Link to={'/dashboard'} className="text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all font-medium cursor-pointer">
                  Quản lý
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-x-4">
              {user ? (
                <button onClick={logoutUser} className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-500 hover:to-pink-500 hover:text-white font-medium transition-all hover:shadow-lg cursor-pointer">
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to={'/login'}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer"
                >
                  Đăng nhập
                </Link>
              )}
              <Link
                to={'/cart'}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all group cursor-pointer"
              >
                <PiShoppingCartThin className="text-3xl text-blue-600 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
