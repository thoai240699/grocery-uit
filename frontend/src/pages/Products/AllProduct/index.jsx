import LoaderComponent from '@/components/ui/LoaderComponent'
import { axiosClient } from '@/utils/axiosClient'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IoMdTrash, IoMdSearch, IoMdClose, IoMdFunnel } from 'react-icons/io'

const AllProducts = () => {

    const [loading, setLoading] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [categories, setCategories] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const [searchInput, setSearchInput] = useState('') // Local search input

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        category: '',
        q: '',
        min_price: '',
        max_price: '',
        sort: ''
    })

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

    const handleSearchChange = (value) => {
        setSearchInput(value)
        setFilters(prev => ({
            ...prev,
            q: value,
            page: 1
        }))
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const resetFilters = () => {
        setSearchInput('')
        setFilters({
            page: 1,
            limit: 12,
            category: '',
            q: '',
            min_price: '',
            max_price: '',
            sort: ''
        })
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
        return <div className='flex items-center justify-center min-h-56'>
            <LoaderComponent />
        </div>
    }

    const totalPages = Math.ceil(totalProducts / filters.limit)

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container px-5 mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Quản lý sản phẩm
                    </h1>
                    <p className="text-gray-600">
                        Tổng cộng <span className="font-semibold text-blue-600">{totalProducts}</span> sản phẩm
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                        >
                            <IoMdFunnel className="text-blue-600 text-xl" />
                            <span className="font-semibold text-gray-700">
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
                            </span>
                        </button>

                        {(filters.category || filters.q || filters.min_price || filters.max_price || filters.sort) && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                            >
                                <IoMdClose className="text-lg" />
                                <span className="font-medium">Xóa bộ lọc</span>
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tìm kiếm
                                    </label>
                                    <div className="relative">
                                        <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Nhập tên sản phẩm..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Danh mục
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sắp xếp
                                    </label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="">Mặc định</option>
                                        <option value="price_asc">Giá tăng dần</option>
                                        <option value="price_desc">Giá giảm dần</option>
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Giá tối thiểu
                                    </label>
                                    <input
                                        type="number"
                                        value={filters.min_price}
                                        onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value, page: 1 }))}
                                        placeholder="0"
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Giá tối đa
                                    </label>
                                    <input
                                        type="number"
                                        value={filters.max_price}
                                        onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value, page: 1 }))}
                                        placeholder="∞"
                                        min="0"
                                        step="1"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Hiển thị
                                    </label>
                                    <select
                                        value={filters.limit}
                                        onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value={8}>8 sản phẩm</option>
                                        <option value={12}>12 sản phẩm</option>
                                        <option value={24}>24 sản phẩm</option>
                                        <option value={48}>48 sản phẩm</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap -m-4">
                    {
                        products.length > 0 ? (
                            products.map((cur) => (
                                <Card fetchAllProducts={fetchAllProducts} key={cur.id} data={cur} />
                            ))
                        ) : (
                            <div className="w-full py-20">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Không có sản phẩm
                                    </h3>
                                    <p className="text-gray-500">
                                        Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem kết quả khác
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>

                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                        <button
                            onClick={() => handleFilterChange('page', filters.page - 1)}
                            disabled={filters.page === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                                            onClick={() => handleFilterChange('page', pageNum)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filters.page === pageNum
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                } else if (
                                    pageNum === filters.page - 2 ||
                                    pageNum === filters.page + 2
                                ) {
                                    return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>
                                }
                                return null
                            })}
                        </div>

                        <button
                            onClick={() => handleFilterChange('page', filters.page + 1)}
                            disabled={filters.page === totalPages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default AllProducts


const Card = ({ data, fetchAllProducts }) => {

    const [loading, setLoading] = useState(false)

    const deleteHandler = async () => {
        try {
            toast.success('Đã xóa sản phẩm') // Triển khai sau

        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)

        } finally {
            setLoading(false)
        }
    }

    const isLowStock = data.stock < 10
    const isOutOfStock = data.stock === 0

    return (
        <div className="p-4 md:w-1/3 lg:w-1/4">
            <div className="group h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                <div className="relative overflow-hidden bg-gray-100">
                    <img
                        className="h-56 w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        src={data.image_url}
                        alt={data.name}
                        loading="lazy"
                    />

                    {isOutOfStock ? (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Hết hàng
                        </div>
                    ) : isLowStock ? (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Sắp hết
                        </div>
                    ) : null}
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                            {data.category?.name || 'Chưa phân loại'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {data.name}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Kho: <span className={isLowStock ? 'text-orange-600 font-semibold' : 'text-gray-700'}>{data.stock}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={deleteHandler}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <IoMdTrash className="text-lg" />
                            <span className="text-sm">Xóa</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}