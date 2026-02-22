import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ROLE_TYPE } from '@/constant/auth.constant'
import { UserSlicePath } from '@/redux/slice/user.slice'

const Card = ({ title, description, to }) => {
  return (
    <Link
      to={to}
      className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all'
    >
      <h3 className='text-lg font-semibold text-zinc-900'>{title}</h3>
      <p className='text-zinc-600 mt-1 text-sm'>{description}</p>
    </Link>
  )
}

const Dashboard = () => {
  const user = useSelector(UserSlicePath)

  const customerCards = [
    { title: 'Đơn hàng của tôi', description: 'Theo dõi trạng thái và lịch sử mua hàng.', to: '/orders' },
    { title: 'Giỏ hàng', description: 'Xem lại sản phẩm trước khi thanh toán.', to: '/cart' },
    { title: 'Yêu thích', description: 'Danh sách sản phẩm bạn đã lưu.', to: '/wishlist' },
  ]

  const staffCards = [
    { title: 'Quản lý đơn', description: 'Xác nhận và cập nhật trạng thái đơn hàng.', to: '/staff/orders' },
    { title: 'Tất cả sản phẩm', description: 'Kiểm tra và chỉnh sửa sản phẩm.', to: '/AllProduct' },
    { title: 'Thêm sản phẩm', description: 'Tạo mới sản phẩm cho cửa hàng.', to: '/AddProduct' },
    { title: 'Thêm danh mục', description: 'Quản lý danh mục sản phẩm.', to: '/AddProductCategories' },
  ]

  const adminCards = [
    { title: 'Khách hàng', description: 'Xem danh sách và thông tin khách hàng.', to: '/Customers' },
    { title: 'Nhân viên', description: 'Quản lý nhân viên và quyền truy cập.', to: '/Employees' },
    { title: 'Sản phẩm', description: 'Xem sản phẩm toàn hệ thống.', to: '/AdminAllProduct' },
  ]

  let cards = customerCards
  if (user?.role === ROLE_TYPE.STAFF) cards = staffCards
  if (user?.role === ROLE_TYPE.ADMIN) cards = adminCards

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold text-zinc-900'>Bảng điều khiển</h1>
      <p className='text-zinc-500 mt-2'>Xin chào {user?.name || 'bạn'}, chọn chức năng bạn muốn làm việc.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6'>
        {cards.map((card) => (
          <Card
            key={card.to}
            title={card.title}
            description={card.description}
            to={card.to}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard