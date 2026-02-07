import CartButton from '@/pages/ProductPage/CartButton'
import LoaderComponent from '@/components/ui/LoaderComponent'
import { ROLE_TYPE } from '@/constant/auth.constant'
import { useAuthContext } from '@/context/AuthContext'
import { axiosClient } from '@/utils/axiosClient'
import clsx from 'clsx'
import React, { useEffect, useState, useCallback, memo } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductPage = () => {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({})

  const fetchProductBySlug = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get("/products/slug/" + slug)
      const data = await response.data
      setProduct(data)
    } catch (error) {
      const status = error?.response?.status
      if (status === 404) {
        try {
          const fallbackResponse = await axiosClient.get("/products/id/" + slug)
          const fallbackData = await fallbackResponse.data
          setProduct(fallbackData)
          return
        } catch (fallbackError) {
          toast.error(fallbackError?.response?.data?.detail || fallbackError.message)
          return
        }
      }
      toast.error(error?.response?.data?.detail || error.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchProductBySlug()
  }, [fetchProductBySlug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <LoaderComponent />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {product.category?.name || 'Sản phẩm'}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="w-full pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 lg:p-12 flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
                <div className="w-full">
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <img
                      alt={product.name || 'Sản phẩm'}
                      className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-300"
                      src={product.image_url}
                    />
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-4 pb-6 mb-8 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        fill={i < 4 ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm font-medium">4.0 <span className="text-gray-400">(4 đánh giá)</span></span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-green-600 text-sm font-semibold">Còn hàng</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                    Mô Tả Sản Phẩm
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto space-y-6">
                  {/* Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-gray-600 text-sm font-medium mb-2">Giá hiện tại</p>
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <CartButton product_id={product.id} />
                    </div>
                    <ToggleWishListButton product_id={product.id} />
                  </div>

                  {/* Social Share */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      Chia Sẻ Sản Phẩm
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => {
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
                          window.open(url, '_blank', 'width=600,height=400');
                        }}
                        className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:shadow-lg text-blue-600 rounded-xl transition-all duration-300 group"
                      >
                        <svg fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const text = `Xem sản phẩm: ${product.name} - ${window.location.href}`;
                          const url = `https://zalo.me/?text=${encodeURIComponent(text)}`;
                          window.open(url, '_blank', 'width=600,height=400');
                        }}
                        className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:shadow-lg text-blue-600 rounded-xl transition-all duration-300 group"
                      >
                        <svg fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const url = `https://www.instagram.com/?text=${encodeURIComponent(`Xem sản phẩm: ${product.name}`)}`;
                          window.open(`https://www.instagram.com/`, '_blank');
                          toast.info('Sao chép đường dẫn để chia sẻ trên Instagram');
                        }}
                        className="p-3 bg-gradient-to-r from-pink-50 to-rose-100 hover:from-pink-100 hover:to-rose-200 hover:shadow-lg text-pink-600 rounded-xl transition-all duration-300 group"
                      >
                        <svg fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.011 4.85.069 1.366.062 2.633.338 3.608 1.313.975.975 1.251 2.242 1.313 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.338 2.633-1.313 3.608-.975.975-2.242 1.251-3.608 1.313-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.338-3.608-1.313-.975-.975-1.251-2.242-1.313-3.608-.058-1.266-.069-1.646-.069-4.85s.011-3.584.069-4.85c.062-1.366.338-2.633 1.313-3.608.975-.975 2.242-1.251 3.608-1.313 1.266-.058 1.646-.069 4.85-.069m0-2.163C8.695 0 8.287.012 7.061.069c-1.608.074-3.084.371-4.308 1.595C1.529 2.888 1.232 4.364 1.158 5.972.101 7.198.088 7.606.088 12c0 4.394.012 4.802.069 6.028.074 1.608.371 3.084 1.595 4.308 1.224 1.224 2.7 1.521 4.308 1.595 1.226.057 1.634.069 6.028.069s4.802-.012 6.028-.069c1.608-.074 3.084-.371 4.308-1.595 1.224-1.224 1.521-2.7 1.595-4.308.057-1.226.069-1.634.069-6.028s-.012-4.802-.069-6.028c-.074-1.608-.371-3.084-1.595-4.308-1.224-1.224-2.7-1.521-4.308-1.595C15.202.012 14.794 0 10 0z" />
                          <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                          <circle cx="18.406" cy="5.594" r="1.44" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductPage


const ToggleWishListButton = memo(function ToggleWishListButton({ product_id }) {
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false)
  const { user } = useAuthContext()
  const [isLiked, setIsLiked] = useState(false)

  const checkExist = useCallback(async () => {
    try {
      if (!token) return
      if (user.role != ROLE_TYPE.BUYER) return
      const response = await axiosClient.get("/wishlist/get/" + product_id, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      const data = response.data
      if (data.exist) {
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || error.messaga)
    }
  }, [token, user, product_id])

  const navigate = useNavigate()

  useEffect(() => {
    checkExist()
  }, [checkExist])

  if (!token) {
    return (
      <button
        onClick={() => {
          toast.error("Vui lòng đăng nhập")
          navigate("/login")
        }}
        className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 group"
      >
        <svg
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          className="w-6 h-6 text-gray-600 group-hover:text-gray-700"
          viewBox="0 0 24 24"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>
    )
  }

  const toggleProductWishList = async () => {
    try {
      if (user.role != ROLE_TYPE.BUYER) return

      setLoading(true)
      const response = await axiosClient.post("/wishlist/toggle", {
        product_id
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      const data = await response.data
      await checkExist()
      toast.success(data.msg)
    } catch (error) {
      toast.error(error?.response?.data?.detail || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      onClick={toggleProductWishList}
      className={clsx(
        "p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md",
        isLiked
          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-500 hover:from-red-100 hover:to-pink-100"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300"
      )}
    >
      {loading ? (
        <CgSpinner className="animate-spin text-2xl" />
      ) : (
        <svg
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          className="w-6 h-6"
          viewBox="0 0 24 24"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      )}
    </button>
  )
})
