import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
const Logo = ({className}) => {
    return (
        <>
                  <Link to="/" className={"flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" + className}
                  >
                    <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-full bg-yellow-500 p-0.5" />
                    <span className="ml-3 text-xl">Myconbini</span>
                  </Link>
        </>
    )
};

export default Logo;