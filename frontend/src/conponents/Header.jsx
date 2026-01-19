import React from 'react';
import { Link } from 'react-router-dom';
import { PiShoppingCartThin } from "react-icons/pi";

const Header = () => {
  return (
    <>
      <header class="text-gray-600 body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="w-10 h-10 text-white p-2 bg-yellow-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span class="ml-3 text-xl">Cửa hàng tiện lợi</span>
          </a>
          <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link to={'/'} class="mr-5 hover:text-gray-900">
              Về chúng tôi
            </Link>
            <Link to={'/'} class="mr-5 hover:text-gray-900">
              Đăng nhập
            </Link>
          </nav>
          <Link
            to={'/cart'}
            className="p-3 text-xl bg-orange-400 text-white rounded-full"
          >
           <PiShoppingCartThin className='text-3xl' />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
