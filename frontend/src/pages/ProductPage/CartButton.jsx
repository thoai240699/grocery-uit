import { ROLE_TYPE } from '@/constant/auth.constant'
import { CART_OPERATIONS } from '@/constant/cart.constant'
import { useAuthContext } from '@/context/AuthContext'
import { axiosClient } from '@/utils/axiosClient'
import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CartButton = ({ product_id }) => {

    const { user } = useAuthContext()
    const token = localStorage.getItem("token")
    const [qty, setQty] = useState(0)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [loading, setLoading] = useState(true)

    const fetchExistCart = async () => {
        try {

            const response = await axiosClient.get("/cart/get/" + product_id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")

                }
            })
            const data = await response.data
            setQty(data.qty)
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setLoading(false)
        }
    }
    const addCart = async () => {
        try {

            if (!token) {
                navigate("/login")
                toast.success("Login Required")
                return
            }

            if (user.role != ROLE_TYPE.BUYER) {
                toast.error("Login With Buyer Account")
                return
            }


            const response = await axiosClient.post("/cart/add", {
                product_id: product_id
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
            const data = await response.data
            toast.success(data.msg)
            await fetchExistCart()


        } catch (e) {
            toast.error(e?.response?.data?.detail || e.message)
        }
    }
    const cartOperation = async (operation = '') => {
        try {

            const response = await axiosClient.put(`/cart/product/${product_id}/${operation}`, {}, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })

            const data = await response.data
            toast.success(data.msg)
            await fetchExistCart()

        } catch (e) {
            toast.error(e?.response?.data?.detail || e.message)

        }
    }


    useEffect(() => {
        if (token && user.role == ROLE_TYPE.BUYER) {

            fetchExistCart()
        }
    }, [pathname])



    return (
        <>
            {parseInt(qty) > 0 ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-1 shadow-lg hover:shadow-xl transition-all">
                    <button
                        onClick={() => cartOperation(CART_OPERATIONS.decrement)}
                        className="p-3 hover:bg-red-500 rounded-lg transition-all duration-300 text-white hover:scale-110 bg-red-400"
                    >
                        <FaMinus className="text-sm" />
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-lg py-2 px-4">{qty}</span>
                    <button
                        onClick={() => cartOperation(CART_OPERATIONS.increment)}
                        className="p-3 hover:bg-green-500 rounded-lg transition-all duration-300 text-white hover:scale-110 bg-green-400"
                    >
                        <FaPlus className="text-sm" />
                    </button>
                    <button
                        onClick={() => cartOperation(CART_OPERATIONS.delete)}
                        className="p-3 hover:bg-red-600 rounded-lg transition-all duration-300 text-white hover:scale-110 bg-red-500"
                    >
                        <FaTrash className="text-sm" />
                    </button>
                </div>
            ) : (
                <button
                    disabled={loading}
                    onClick={addCart}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {loading ? 'Đang tải...' : 'Thêm vào giỏ hàng'}
                </button>
            )}
        </>
    )
}

export default CartButton