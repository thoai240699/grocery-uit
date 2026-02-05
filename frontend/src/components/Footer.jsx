import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { IoMdMail, IoMdCall, IoMdPin } from 'react-icons/io'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-50 via-blue-50/30 to-white border-t border-gray-200 mt-20">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Về Chúng Tôi
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Cửa hàng tiện lợi hàng đầu, cung cấp sản phẩm chất lượng cao với giá cả cạnh tranh.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all cursor-pointer">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all cursor-pointer">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all cursor-pointer">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-blue-600 hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all cursor-pointer">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Trang chủ
                </Link>
              </li>
              <li>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Tài khoản
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Hỗ Trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Liên Hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <IoMdPin className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <IoMdCall className="text-blue-600 flex-shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <IoMdMail className="text-blue-600 flex-shrink-0" />
                <span>23540035@uit.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ecommerce Farm</span>. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer