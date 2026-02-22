import React from 'react'
import { useSearchParams } from 'react-router-dom'

const FailedPage = () => {
  const [params] = useSearchParams()

  return (
    <>
      <img src={"https://www.onlygfx.com/wp-content/uploads/2020/05/fail-stamp-7.png"} className='w-1/3 mx-auto' alt="" />
      <p className="text-2xl font-bold text-center">Thanh toán thất bại</p>
      {params.get('message') ? <p className="text-center text-gray-600 mt-2">{params.get('message')}</p> : null}
    </>
  )
}

export default FailedPage