import AuthButton from "@/components/ui/AuthButton";
import Logo from "@/components/ui/Logo";
import { useAuthContext } from "@/context/AuthContext";
import { axiosClient } from "@/utils/axiosClient";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const LoginUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHide, setIsHide] = useState(true);

  const navigate = useNavigate()
  const { fetchUserProfile } = useAuthContext();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.post("/auth/login", values)
      const data = response.data
      
      localStorage.setItem("token", data.token)
      await fetchUserProfile()
      toast.success(data.msg)
      
      helpers.resetForm()

      navigate("/dashboard")
    } catch (e) {
      console.log(e)
      toast.error(e.response?.data?.detail || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
  });

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
      <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={onSubmitHandler}>
        {({ errors, touched }) => (
        <Form className="min-h-screen flex items-center justify-center">
          <div className="w-[96%] mx-auto lg:w-1/2 xl:w-1/3 p-4 rounded border border-gray-100 shadow">
            <div className="mb-3 w-full flex justify-center">
              <Logo className="mx-auto block" />
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="email">Email <span className="text-red-600">*</span></label>
              <Field
                name="email"
                id="email"
                type="email"
                className={`w-full py-3 px-2 rounded bg-gray-100 border outline-none ${errors.email && touched.email ? "border-red-500 animate-shake" : "border-gray-200"}`}
                placeholder="Nhập địa chỉ email..." />
              <div className="absolute -bottom-5 left-0 w-full">
                <ErrorMessage name="email" className="text-red-600 text-xs" component="div" />
              </div>
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password">Mật khẩu<span className="text-red-600">*</span></label>
              <div
                className={`w-full px-2 rounded bg-gray-100 border outline-none flex ${errors.password && touched.password ? "border-red-500 animate-shake" : "border-gray-200"}`}
              >
                <Field
                  name="password"
                  id="password"
                  type={isHide ? "password" : "text"}
                  className="w-full py-3 outline-none"
                  placeholder="Nhập mật khẩu..." />
                <button
                  type="button"
                  onClick={() => setIsHide(!isHide)}
                  className="text-xl text-gray-700 ml-2"
                >
                  {isHide ?
                    <FaEye /> :
                    <FaEyeSlash />}
                </button>
              </div>
              <div className="absolute -bottom-5 left-0 w-full">
                <ErrorMessage name="password" className="text-red-600 text-xs" component="div" />
              </div>
            </div>

            <div className="mb-3">
              <AuthButton isLoading={isLoading} text="Đăng nhập" />
            </div>
            <div className="mb-3 flex justify-center items-center gap-x-6">
              <div className="w-full h-[0.1000px] bg-gray-400"></div>
              <div className="">Hoặc</div>
              <div className="w-full h-[0.1000px] bg-gray-400"></div>
            </div>

            <div className="mb-3 text-center">
              <p>
                Bạn chưa có tài khoản? Hãy <Link to={'/register'} className='text-orange-600'>đăng ký</Link>
              </p>
            </div>
          </div>
        </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginUser;
