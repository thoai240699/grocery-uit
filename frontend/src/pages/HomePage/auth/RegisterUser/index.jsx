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

const RegisterUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const [isConfirmHide, setIsConfirmHide] = useState(true);

  const navigate = useNavigate()
  const { fetchUserProfile } = useAuthContext();

  const onSubmitHandler = async (values, helpers) => {
    const { confirmPassword, ...registerData } = values;
    try {
      setIsLoading(true)
      const response = await axiosClient.post("/auth/register", registerData)
      const data = response.data

      toast.success(data.msg)
      localStorage.setItem("token", data.token)
      await fetchUserProfile()

      helpers.resetForm()
      navigate("/dashboard")
    } catch (e) {
      toast.error(e.response?.data?.detail || e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp').required('Vui lòng nhập lại mật khẩu'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Gradient Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Logo */}
          <div className="mb-8 text-center">
            <Logo className="mx-auto block mb-4" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Tạo Tài Khoản Mới
            </h1>
            <p className="text-gray-600 text-sm">Tham gia và khám phá hàng ngàn sản phẩm</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="email"
                    id="email"
                    type="email"
                    className={`w-full py-3 px-4 rounded-xl bg-white border-2 outline-none transition-all ${errors.email && touched.email
                      ? "border-red-500 animate-shake"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && touched.email && (
                    <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">
                      <ErrorMessage name="email" />
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      id="password"
                      type={isHide ? "password" : "text"}
                      className={`w-full py-3 px-4 pr-12 rounded-xl bg-white border-2 outline-none transition-all ${errors.password && touched.password
                        ? "border-red-500 animate-shake"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setIsHide(!isHide)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {isHide ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">
                      <ErrorMessage name="password" />
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      id="confirmPassword"
                      type={isConfirmHide ? "password" : "text"}
                      className={`w-full py-3 px-4 pr-12 rounded-xl bg-white border-2 outline-none transition-all ${errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500 animate-shake"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setIsConfirmHide(!isConfirmHide)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {isConfirmHide ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium">
                      <ErrorMessage name="confirmPassword" />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <span className="text-sm text-gray-500 font-medium">Hoặc</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Đã có tài khoản?{' '}
                    <Link
                      to="/login"
                      className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-blue-600 hover:underline cursor-pointer">
            Điều khoản sử dụng
          </a>{' '}
          và{' '}
          <a href="#" className="text-blue-600 hover:underline cursor-pointer">
            Chính sách bảo mật
          </a>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
      )}
      </Formik >
    </>
  );
};

export default RegisterUser;
