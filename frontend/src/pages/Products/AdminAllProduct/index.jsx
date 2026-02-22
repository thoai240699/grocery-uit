import LoaderComponent from '@/components/ui/LoaderComponent'
import { axiosClient } from '@/utils/axiosClient'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IoMdSearch, IoMdClose, IoMdArrowDropdown, IoMdAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'

const AdminAllProducts = () => {
    const [loading, setLoading] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [categories, setCategories] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const [searchInput, setSearchInput] = useState('')

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

            console.log("Fetched products:", data)
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

    const handleDelete = async (productId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return
        try {
            await axiosClient.delete(`/products/${productId}`)
            toast.success('Xóa sản phẩm thành công')
            fetchAllProducts()
        } catch (error) {
            toast.error('Lỗi khi xóa sản phẩm')
        }
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
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-50">
                <LoaderComponent />
            </div>
        )
    }

    const totalPages = Math.ceil(totalProducts / filters.limit)

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50">
            {/* Header Section */}
            <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
                <div className="relative max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                Quản Lý Sản Phẩm
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600">
                                Tổng cộng <span className="font-bold text-blue-600">{totalProducts}</span> sản phẩm trong hệ thống
                            </p>
                        </div>
                        <Link
                            to="/admin/add-product"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        >
                            <IoMdAdd className="text-xl" />
                            Thêm Sản Phẩm
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-4">
                            {/* Search Bar */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Tìm Kiếm</label>
                                <div className="relative">
                                    <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        placeholder="Tên sản phẩm..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                    Danh Mục
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                                        className={`w-full px-4 py-2.5 rounded-lg text-left font-medium transition-all ${filters.category === ''
                                                ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Tất Cả
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFilters(prev => ({ ...prev, category: cat.name, page: 1 }))}
                                            className={`w-full px-4 py-2.5 rounded-lg text-left font-medium transition-all ${filters.category === cat.name
                                                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 text-gray-700 font-medium transition-all"
                            >
                                <span>Bộ Lọc Nâng Cao</span>
                                <IoMdArrowDropdown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {showFilters && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
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
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Giá Tối Thiểu</label>
                                        <input
                                            type="number"
                                            value={filters.min_price}
                                            onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value, page: 1 }))}
                                            placeholder="0"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Giá Tối Đa</label>
                                        <input
                                            type="number"
                                            value={filters.max_price}
                                            onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value, page: 1 }))}
                                            placeholder="∞"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Reset Button */}
                            {(filters.category || filters.q || filters.min_price || filters.max_price || filters.sort) && (
                                <button
                                    onClick={resetFilters}
                                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-red-500/10 to-pink-500/10 text-red-600 px-4 py-3 rounded-lg border border-red-200 hover:bg-linear-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all"
                                >
                                    <IoMdClose className="text-lg" />
                                    Xóa Bộ Lọc
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Table/List */}
                    <div className="lg:col-span-4">
                        {products.length > 0 ? (
                            <>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-linear-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Sản Phẩm</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Danh Mục</th>
                                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Giá</th>
                                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Hành Động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-blue-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {product.image_url && (
                                                                    <img
                                                                        src={product.image_url}
                                                                        alt={product.name}
                                                                        className="w-10 h-10 rounded-lg object-cover"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-right font-semibold text-blue-600">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                        </td>
                                                        {/* <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Xóa sản phẩm"
                                                                >
                                                                    <IoMdTrash className="text-lg" />
                                                                </button>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={filters.page === 1}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
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
                                                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filters.page === pageNum
                                                                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    )
                                                } else if (pageNum === filters.page - 2 || pageNum === filters.page + 2) {
                                                    return (
                                                        <span key={pageNum} className="px-2 py-2 text-gray-400">
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
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="text-6xl mb-6">📦</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Không Có Sản Phẩm</h3>
                                <p className="text-gray-600 text-center mb-8">Hãy thêm sản phẩm đầu tiên của bạn</p>
                                <Link
                                    to="/admin/add-product"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    <IoMdAdd className="text-lg" />
                                    Thêm Sản Phẩm
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AdminAllProducts
