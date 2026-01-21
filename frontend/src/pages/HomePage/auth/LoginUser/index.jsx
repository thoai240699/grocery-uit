import React from "react";
import Logo from "@/components/ui/Logo";

const LoginUser = () => {
  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="lg:w01/2 p-4 rounded border border-gray-100 shadow">
          <div className="mb-3">
            <Logo />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginUser;
