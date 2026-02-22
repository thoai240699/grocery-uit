import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SuccessPage = () => {
  const [params] = useSearchParams()

  return (
    <>
      <img src={"https://www.pngplay.com/wp-content/uploads/8/Success-Background-PNG-Image.png"} className='w-1/3 mx-auto' alt="" />
      <p className="text-2xl font-bold text-center">Thanh toán thành công</p>
      {params.get('orderId') ? <p className="text-center text-gray-600 mt-2">Mã đơn: {params.get('orderId')}</p> : null}
    </>
  )
}

export default SuccessPage