import LoaderComponent from '@/components/ui/LoaderComponent'
import { axiosClient } from '@/utils/axiosClient'
import clsx from 'clsx'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const formatVnd = (value = 0) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
}).format(Number(value) || 0)

const STATUS_OPTIONS = ['confirmed', 'shipping', 'delivered', 'cancelled']

const statusClass = {
    pending_payment: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
}

const StaffOrdersPage = () => {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [updatingOrderId, setUpdatingOrderId] = useState('')

    const fetchOrders = async () => {
        try {
            const response = await axiosClient.get('/admin/orders/', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            const payload = response?.data
            setOrders(payload?.items || [])
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId, nextStatus) => {
        try {
            setUpdatingOrderId(orderId)
            await axiosClient.put(`/admin/orders/${orderId}/status/${nextStatus}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            toast.success(`Đã cập nhật trạng thái: ${nextStatus}`)
            await fetchOrders()
        } catch (error) {
            toast.error(error?.response?.data?.detail || error.message)
        } finally {
            setUpdatingOrderId('')
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) {
        return <div className='w-full min-h-56 flex items-center justify-center'>
            <LoaderComponent />
        </div>
    }

    if ((orders || []).length === 0) {
        return <div className='max-w-4xl mx-auto py-20 px-4 text-center'>
            <h2 className='text-3xl font-bold text-zinc-900'>Chưa có đơn hàng</h2>
            <p className='text-zinc-500 mt-2'>Không có đơn hàng nào cần xử lý.</p>
        </div>
    }

    return (
        <div className='max-w-6xl mx-auto py-8 px-4'>
            <div className='mb-6'>
                <h1 className='text-3xl font-bold text-zinc-900'>Quản lý đơn hàng (Staff)</h1>
                <p className='text-zinc-500 mt-1'>Chỉ tài khoản staff mới có quyền đổi trạng thái đơn.</p>
            </div>

            <div className='space-y-4'>
                {orders.map((order) => (
                    <div key={order.id} className='rounded-2xl border border-zinc-200 bg-white shadow-sm p-4'>
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                            <div>
                                <p className='text-xs uppercase tracking-wide text-zinc-500'>Mã đơn</p>
                                <p className='font-semibold text-zinc-900'>{order.order_code}</p>
                                <p className='text-sm text-zinc-500 mt-1'>{moment(order.created_at).format('LLL')}</p>
                            </div>

                            <div className='flex items-center gap-2 flex-wrap'>
                                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', statusClass[order.order_status] || 'bg-zinc-100 text-zinc-700')}>
                                    {order.order_status}
                                </span>
                                <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                                    {order.payment_status}
                                </span>
                                <span className='px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700'>
                                    {order.payment_method}
                                </span>
                            </div>
                        </div>

                        <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                            <p className='font-semibold text-zinc-900'>Tổng đơn: {formatVnd(order.amount)}</p>

                            <div className='flex items-center gap-2 flex-wrap'>
                                {STATUS_OPTIONS.map((status) => (
                                    <button
                                        key={status}
                                        disabled={updatingOrderId === order.id || order.order_status === status}
                                        onClick={() => updateStatus(order.id, status)}
                                        className={clsx(
                                            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                                            order.order_status === status
                                                ? 'bg-zinc-200 border-zinc-200 text-zinc-500 cursor-not-allowed'
                                                : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50',
                                            updatingOrderId === order.id && 'opacity-60 cursor-not-allowed'
                                        )}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StaffOrdersPage
