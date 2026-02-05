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
      <section className="w-full pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative bg-white p-8 lg:p-12">
                <div className="sticky top-24">
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img
                      alt={product.name || 'Sản phẩm'}
                      className="w-full h-full object-contain p-8"
                      src={product.image_url}
                    />
                  </div>
                  {product.category?.name && (
                    <div className="mt-6 flex justify-center">
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 text-sm font-bold rounded-full border border-purple-100">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {product.category?.name || 'Chưa phân loại'}
                  </p>
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
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
                  <span className="text-gray-600 text-sm font-medium">4.0 (4 đánh giá)</span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Mô Tả Sản Phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CartButton product_id={product.id} />
                    </div>
                    <ToggleWishListButton product_id={product.id} />
                  </div>

                  {/* Social Share */}
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Chia Sẻ:</p>
                    <div className="flex gap-3">
                      <button className="p-3 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full transition-all duration-300">
                        <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-blue-400 hover:text-white rounded-full transition-all duration-300">
                        <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-green-500 hover:text-white rounded-full transition-all duration-300">
                        <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
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
