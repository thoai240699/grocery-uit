import React from 'react';
import { Link } from 'react-router-dom';
import { PiShoppingCartThin } from "react-icons/pi";
import Logo from './ui/Logo';
import { UserSlicePath } from '@/redux/slice/user.slice';
import { useSelector } from 'react-redux';
import { useAuthContext } from '@/context/AuthContext';
import { setCollapse, setToggle, SidebarSlicePath } from '@/redux/slice/sidebar.slice';
import { IoIosMenu } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const user = useSelector(UserSlicePath);
  const { logoutUser } = useAuthContext()
  const { pathname } = useLocation()
  const protected_route = ['/dashboard', '/profile', '/AddProduct', '/AllProduct', '/orders', '/wishlist', '/checkout']
  const dispatch = useDispatch()
  const { isToggle, isCollapse } = useSelector(SidebarSlicePath)

  return (
    <>
      <header className="text-gray-600 body-font bg-white sticky top-0 z-10 border-b border-orange-200">
        <div className="flex justify-between items-center p-4">
          {/* Left Side */}
          <div className="flex items-center gap-x-4">
            {protected_route.includes(pathname) && (
              <>
                <button
                  className="text-2xl text-orange-500 cursor-pointer bg-gray-100 rounded-full p-2 hidden md:block"
                  onClick={() => dispatch(setCollapse())}
                >
                  <IoIosMenu className={`transition-transform duration-300 ${isCollapse ? 'rotate-90' : ''}`} />
                </button>
                <button
                  className="text-2xl text-orange-500 cursor-pointer bg-gray-100 rounded-full p-2 block md:hidden"
                  onClick={() => dispatch(setToggle())}
                >
                  <IoIosMenu />
                </button>
              </>
            )}
            <Logo />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-x-6">
            <nav className="hidden md:flex items-center gap-x-6 text-base">
              <Link to={'/'} className="hover:text-orange-600 transition-colors">
                Về chúng tôi
              </Link>
              {user && (
                <Link to={'/dashboard'} className="hover:text-orange-600 transition-colors">
                  Quản lý
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-x-4">
              {user ? (
                <button onClick={logoutUser} className="hover:text-orange-600 transition-colors">
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to={'/login'}
                  className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
              <Link
                to={'/cart'}
                className="relative p-2 rounded-full hover:bg-orange-100 transition-colors"
              >
                <PiShoppingCartThin className="text-3xl" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
