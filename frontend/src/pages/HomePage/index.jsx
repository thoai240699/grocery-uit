import LoaderComponent from '@/components/ui/LoaderComponent'
import React, { useEffect, useState } from 'react'
import { axiosClient } from '@/utils/axiosClient'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import { IoMdClose, IoMdArrowDropdown } from 'react-icons/io'

const HomePage = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    q: '',
    min_price: '',
    max_price: '',
    sort: ''
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qParam = params.get('q')
    if (qParam !== null && qParam !== filters.q) {
      setFilters(prev => ({ ...prev, q: qParam, page: 1 }))
    }
  }, [location.search])

  const fetchAllProducts = async () => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      }

      const params = {}
      if (filters.page) params.page = parseInt(filters.page)
      if (filters.limit) params.limit = parseInt(filters.limit)
      if (filters.category && filters.category.trim()) params.category = filters.category.trim()
      if (filters.q && filters.q.trim()) params.q = filters.q.trim()
      if (filters.min_price) params.min_price = Math.floor(Number(filters.min_price))
      if (filters.max_price) params.max_price = Math.floor(Number(filters.max_price))
      if (filters.sort) params.sort = filters.sort

      const response = await axiosClient.get("/products", { params })
      const data = await response.data
      setProducts(data?.items || [])
      setTotalProducts(data?.total || 0)

      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || error.message)
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories")
      setCategories(response.data?.items || [])
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error)
    }
  }

  const resetFilters = () => {
    setActiveCategory('')
    setFilters({
      page: 1,
      limit: 12,
      category: '',
      q: '',
      min_price: '',
      max_price: '',
      sort: ''
    })
    window.history.replaceState({}, '', '/')
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllProducts()
    }, 600)
    return () => clearTimeout(timer)
  }, [filters.q])

  useEffect(() => {
    fetchAllProducts()
  }, [filters.page, filters.limit, filters.category, filters.min_price, filters.max_price, filters.sort])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <LoaderComponent />
      </div>
    )
  }

  const totalPages = Math.ceil(totalProducts / filters.limit)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Main Content Area */}
      <section className="w-full pt-8 pb-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 backdrop-blur-sm">
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 })) || setActiveCategory('')}
                      className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 ${filters.category === ''
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Tất Cả Sản Phẩm
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, category: cat.name, page: 1 }))
                          setActiveCategory(cat.name)
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 ${filters.category === cat.name
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 text-gray-700 font-medium transition-all"
                >
                  <span>Bộ Lọc Nâng Cao</span>
                  <IoMdArrowDropdown className={`text-xl transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sắp Xếp</label>
                      <select
                        value={filters.sort}
                        onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">Mặc Định</option>
                        <option value="price_asc">Giá: Thấp đến Cao</option>
                        <option value="price_desc">Giá: Cao đến Thấp</option>
                      </select>
                    </div>

                    {/* Min Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Giá Tối Thiểu</label>
                      <input
                        type="number"
                        value={filters.min_price}
                        onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value, page: 1 }))}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Giá Tối Đa</label>
                      <input
                        type="number"
                        value={filters.max_price}
                        onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value, page: 1 }))}
                        placeholder="∞"
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Hiển Thị */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hiển Thị</label>
                      <select
                        value={filters.limit}
                        onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value={8}>8 sản phẩm</option>
                        <option value={12}>12 sản phẩm</option>
                        <option value={24}>24 sản phẩm</option>
                        <option value={48}>48 sản phẩm</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-4">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                    {products.map((product) => (
                      <ProductCard key={product?.id} data={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-16">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={filters.page === 1}
                        className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Trước
                      </button>

                      <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                                className={`
                                  cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all ${filters.page === pageNum
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            )
                          } else if (pageNum === filters.page - 2 || pageNum === filters.page + 2) {
                            return (
                              <span key={pageNum} className="cursor-pointer px-2 py-2 text-gray-400">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                      </div>

                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={filters.page === totalPages}
                        className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <div className="text-6xl mb-6">🌿</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">Không Tìm Thấy Sản Phẩm</h3>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Xóa Bộ Lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

const ProductCard = ({ data }) => {
  return (
    <Link
      to={'/product/' + (data?.slug || data?.id)}
      className="group block h-full"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative bg-white overflow-hidden aspect-square">
          <img
            alt={data?.name || 'Sản phẩm'}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            src={data?.image_url}
            loading="lazy"
          />
          {data?.category?.name && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-bold rounded-full shadow-lg">
                {data.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
            {data?.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">
            {data?.category?.name || 'Chưa phân loại'}
          </p>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.price || 0)}
              </span>
              <span className="text-[10px] text-gray-400 group-hover:text-purple-600 transition-colors">
                Xem Chi Tiết →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}