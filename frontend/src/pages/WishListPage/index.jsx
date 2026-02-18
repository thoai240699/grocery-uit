import LoaderComponent from '@/components/ui/LoaderComponent'
import { axiosClient } from '@/utils/axiosClient'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'
import { IoMdTrash } from 'react-icons/io'
import { FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const WishListPage = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchAllProducts = async () => {
        try {
            const response = await axiosClient.get("/wishlist/get", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
            const data = await response.data
            setProducts(data)
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])

    if (loading) {
        return <div className='flex items-center justify-center min-h-screen w-full'>
            <LoaderComponent />
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-white">
            <style>{`
                @keyframes slideDownFade {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1); }
                    50% { transform: scale(1); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }

                .header-animate {
                    animation: slideDownFade 0.6s ease-out forwards;
                }

                .heart-icon-beat {
                    animation: heartbeat 2s ease-in-out infinite;
                }

                .grid-item-fade {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }

                .empty-state-animate {
                    animation: fadeInUp 0.7s ease-out forwards;
                }
            `}</style>

            {/* Header Section */}
            <div className="bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-opacity-95 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 header-animate">
                    <div className="flex items-center gap-2 mb-1">
                        <FiHeart className="text-xl text-red-500 heart-icon-beat" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                            Danh sách yêu thích
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">{products.length} sản phẩm được lưu</p>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {products.map((product, idx) => (
                            <div
                                key={product.id}
                                className="grid-item-fade"
                                style={{
                                    animationDelay: `${idx * 0.08}s`,
                                }}
                            >
                                <Card
                                    data={product}
                                    onDelete={fetchAllProducts}
                                    onSetProducts={setProducts}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 empty-state-animate">
                        <FiHeart className="text-7xl text-gray-300 mb-4 animate-pulse" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Danh sách yêu thích trống
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Hãy thêm sản phẩm yêu thích của bạn
                        </p>
                        <Link
                            to="/products"
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishListPage

const Card = ({ data, onDelete, onSetProducts }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [hover, setHover] = useState(false)

    const deleteHandler = async () => {
        try {
            setIsDeleting(true)
            const response = await axiosClient.delete("/wishlist/delete/" + data.id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })

            // Optimistic update - remove product immediately
            if (onSetProducts) {
                onSetProducts(prev => prev.filter(p => p.id !== data.id))
            }

            toast.success(response.data?.msg || "Đã xóa sản phẩm khỏi yêu thích")
            await onDelete()
        } catch (error) {
            setIsDeleting(false)
            toast.error(error?.response?.data?.detail || error.message)
        }
    }

    return (
        <>
            <style>{`
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0px) rotateZ(0deg); }
                    50% { transform: translateY(-8px) rotateZ(0.5deg); }
                }

                @keyframes cardHover {
                    from { 
                        transform: translateY(0) scale(1);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    to { 
                        transform: translateY(-12px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    }
                }

                @keyframes deleteButton {
                    from { transform: scale(1) rotate(0deg); }
                    to { transform: scale(1.15) rotate(5deg); }
                }

                .card-wrapper:hover {
                    animation: cardHover 0.3s ease-out forwards;
                }

                .card-wrapper:hover .delete-btn {
                    animation: deleteButton 0.3s ease-out forwards;
                }

                .card-wrapper {
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .img-container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .img-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .card-wrapper:hover .img-container::before {
                    opacity: 1;
                }

                .img-element {
                    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .card-wrapper:hover .img-element {
                    transform: scale(1.1) rotateZ(1deg);
                }

                .delete-btn {
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                .delete-btn:hover:not(:disabled) {
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.6);
                    transform: scale(1.1) rotateZ(-5deg);
                }

                .product-name {
                    transition: all 0.3s ease;
                }

                .card-wrapper:hover .product-name {
                    color: #3b82f6;
                    transform: translateX(2px);
                }

                .badge-anim {
                    animation: fadeInUp 0.5s ease-out 0.2s forwards;
                    opacity: 0;
                }
            `}</style>

            <Link to={'/product/' + data.slug} className="group h-full block">
                <div
                    className="card-wrapper h-full bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 border-opacity-60 flex flex-col hover:border-blue-300"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {/* Image Container - Full cover */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-square img-container">
                        <img
                            className="w-full h-full object-cover img-element"
                            src={data.image_url}
                            alt={data.name}
                        />

                        {/* Delete Button - Overlay */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                deleteHandler()
                            }}
                            disabled={isDeleting}
                            className="delete-btn absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed hover:cursor-pointer text-white rounded-full p-1.5 shadow-lg transition-all duration-200 z-10 flex items-center justify-center"
                            title="Xóa khỏi yêu thích"
                        >
                            <IoMdTrash className="text-sm" />
                        </button>

                        {/* Loading Indicator */}
                        {isDeleting && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                                <div className="w-5 h-5 border-2.5 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Shine Effect */}
                        {hover && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                        )}
                    </div>

                    {/* Content Container */}
                    <div className="px-3 py-3 flex-1 flex flex-col justify-between">
                        {/* Product Name */}
                        <h2 className="product-name text-xs font-semibold text-gray-900 line-clamp-2 mb-2">
                            {data.name}
                        </h2>

                        {/* Date */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 badge-anim">
                            <p className="text-xs text-gray-500 font-medium">
                                {moment(data.created_at).format("DD/MM")}
                            </p>
                            <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                {moment(data.created_at).fromNow()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}