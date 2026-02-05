import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdArrowBack, IoMdAdd, IoMdRemove, IoMdTrash, IoMdCheckmark } from 'react-icons/io'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  const updateCartItem = (productId, newQuantity) => {
    const updated = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeCartItem = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateDiscount = () => {
    return calculateTotal() * 0.05 // 5% discount
  }

  const calculateFinal = () => {
    return calculateTotal() - calculateDiscount()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
          >
            <IoMdArrowBack className="text-lg" />
            Quay Lại Cửa Hàng
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {cartItems.length} sản phẩm trong giỏ
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Giỏ Hàng Trống</h3>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Hãy khám phá các sản phẩm tuyệt vời trong cửa hàng của chúng tôi
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.category?.name || 'Không phân loại'}</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded transition-colors"
                        >
                          <IoMdRemove className="text-lg text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded transition-colors"
                        >
                          <IoMdAdd className="text-lg text-gray-700" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <IoMdTrash className="text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        item.price * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Tổng Cộng</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        calculateTotal()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá (5%)</span>
                    <span className="font-semibold text-green-600">
                      -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        calculateDiscount()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold text-gray-900">Miễn phí</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      calculateFinal()
                    )}
                  </p>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all mb-4">
                  <IoMdCheckmark className="text-lg" />
                  Tiến Hành Thanh Toán
                </button>

                <button className="w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                  Tiếp Tục Mua Sắm
                </button>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    ✓ Giao hàng miễn phí cho đơn hàng trên 500.000 VND
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default CartPage