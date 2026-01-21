import React from "react";
import Logo from "@/components/ui/Logo";

const LoginUser = () => {
  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-[96%] mx-auto lg:1/2 xl:w-1/3 p-4 rounded border border-gray-100 shadow">
          <div className="mb-3 w-full flex justify-center">
            <Logo className="mx-auto block" />
          </div>
          <div className="mb-3">
            <label
            htmlFor="email">Email <span className="text-red-600">*</span></label>
            <input
            id="email"
            type="text" 
            className="w-full py-3 px-2 rounded bg-gray-100 border border-gray-200 outline-none" 
            placeholder="Nhập địa chỉ email..." />
          </div>

          <div className="mb-3">
            <label
            htmlFor="password">Mật khẩu<span className="text-red-600">*</span></label>
            <input 
            id="password" 
            type="text" 
            className="w-full py-3 px-2 rounded bg-gray-100 border border-gray-200 outline-none"
            placeholder="Nhập mật khẩu..." />
          </div>
          <div className="mb-3">
            <button className="w-full py-2 bg-black text-white rounded outline-none cursor-pointer ">Đăng nhập</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginUser;
