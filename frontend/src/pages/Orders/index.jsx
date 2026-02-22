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

const paymentMethodLabel = {
  momo_qr: 'MoMo QR',
  cod: 'COD',
  mock: 'Mock',
}

const orderStatusLabel = {
  pending_payment: 'Chờ thanh toán',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
}

const orderStatusClass = {
  pending_payment: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

const OrdersPage = () => {


  const [loading, setLoading] = useState(true)

  const [orders, setOrders] = useState([])


  const fetchAllOrders = async () => {
    try {
      const response = await axiosClient.get("/orders", {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      const res = await response.data
      setOrders(res)

    } catch (error) {
      toast.error(error?.response?.data?.detail || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])


  if (loading) {
    return <div className="w-full flex items-center justify-center min-h-54">
      <LoaderComponent />
    </div>
  }

  if (orders.length === 0) {
    return <div className='max-w-4xl mx-auto py-24 px-4'>
      <div className='rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center'>
        <h1 className="text-3xl font-bold text-zinc-800">Chưa có đơn hàng</h1>
        <p className='text-zinc-500 mt-2'>Bạn chưa hoàn tất đơn hàng nào. Hãy chọn sản phẩm và checkout để bắt đầu.</p>
      </div>
    </div>
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-zinc-900'>Đơn hàng của tôi</h1>
          <p className='text-zinc-500 mt-1'>Theo dõi lịch sử mua sắm và trạng thái từng đơn.</p>
        </div>
        <div className='rounded-xl border border-zinc-200 bg-white px-4 py-3'>
          <p className='text-xs uppercase tracking-wide text-zinc-500'>Tổng chi tiêu</p>
          <p className='text-xl font-bold text-zinc-900'>{formatVnd(totalSpent)}</p>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((cur) => {
          const paymentLabel = paymentMethodLabel[cur.payment_method] || String(cur.payment_method || '').toUpperCase()
          const statusLabel = orderStatusLabel[cur.order_status] || cur.order_status

          return <article key={cur.id} className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className='p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50'>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className='text-xs uppercase tracking-wide text-zinc-500'>Mã đơn</p>
                  <p className="font-semibold text-zinc-900">{cur.order_code}</p>
                </div>

                <div className='flex items-center gap-2 flex-wrap'>
                  <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', orderStatusClass[cur.order_status] || 'bg-zinc-100 text-zinc-700')}>
                    {statusLabel}
                  </span>
                  <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', cur.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                    {cur.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>

              <div className='mt-3 text-sm text-zinc-600'>
                <span>Phương thức: <span className='font-medium text-zinc-800'>{paymentLabel}</span></span>
                <span className='mx-2'>•</span>
                <span>{moment(cur.created_at).format('LLL')}</span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {(cur.items || []).map((item, i) => {
                  return <div key={item.product_id + i} className='rounded-xl border border-zinc-200 bg-zinc-50 p-3 flex gap-3'>
                    <img src={item.product_image} alt={`image-${i}`} className='w-16 h-16 rounded-lg object-cover object-top bg-white border border-zinc-200' />
                    <div className='min-w-0'>
                      <h4 className="font-semibold text-sm text-zinc-900 truncate">{item.product_name}</h4>
                      <p className='text-xs text-zinc-500 mt-1'>SL: {item.qty}</p>
                      <p className='text-sm font-medium text-zinc-700 mt-1'>{formatVnd(item.total_price || 0)}</p>
                    </div>
                  </div>
                })}
              </div>

              <div className='mt-4 pt-4 border-t border-zinc-100 flex items-center justify-end'>
                <p className='text-lg font-bold text-zinc-900'>Tổng đơn: {formatVnd(cur.amount)}</p>
              </div>
            </div>
          </article>
        })}
      </div>
    </div>
  )
}

export default OrdersPage