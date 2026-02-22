import LoaderComponent from '@/components/ui/LoaderComponent'
import { UserSlicePath } from '@/redux/slice/user.slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { setToggle, SidebarSlicePath } from '@/redux/slice/sidebar.slice'
import { CiShoppingCart, CiUser } from 'react-icons/ci'
import { IoMdHeartEmpty } from 'react-icons/io'
import { IoBagCheckOutline } from 'react-icons/io5'
import { MdBadge, MdDashboard, MdOutlinePersonOutline, MdProductionQuantityLimits } from 'react-icons/md'
import { ROLE_TYPE } from '@/constant/auth.constant'

const ProtectedLayout = () => {
  const user = useSelector(UserSlicePath)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { isToggle, isCollapse } = useSelector(SidebarSlicePath)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-orange-50">
        <LoaderComponent />
      </div>
    )
  }

  return (
    <div className="flex items-start bg-linear-to-b from-slate-50 via-blue-50/30 to-white min-h-screen">
      <Sidebar
        toggled={isToggle}
        collapsed={isCollapse}
        onBackdropClick={() => dispatch(setToggle())}
        breakPoint="md"
        rootStyles={{
          backgroundColor: '#ffffff',
          color: '#1f2937',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out',
          '&.ps-collapsed': {
            '.ps-menu-label, .ps-submenu-content': {
              display: 'none',
            },
          },
        }}
      >
        <Menu
          className="h-[80vh] border-none"
          menuItemStyles={{
            button: {
              padding: '12px 20px',
              color: '#4b5563',
              borderRadius: '12px',
              margin: '4px 8px',
              fontWeight: '500',
              '&:hover': {
                background: 'linear-gradient(to right, #dbeafe, #e0e7ff)',
                color: '#2563eb',
              },
              '&.active': {
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: '#ffffff',
                boxShadow: '0 4px 6px -1px rgb(139 92 246 / 0.3)',
              },
            },
            icon: {
              fontSize: '1.5rem',
            },
          }}
        >
          <MenuItem
            icon={<MdDashboard className="text-2xl text-blue-600" />}
            component={<Link to="/dashboard" />}
          >
            Quản lý
          </MenuItem>

          {user.role === ROLE_TYPE.CUSTOMER ? (
            <>
              <MenuItem
                icon={<IoMdHeartEmpty className="text-2xl text-pink-500" />}
                component={<Link to="/wishlist" />}
              >
                Yêu thích
              </MenuItem>
              <MenuItem
                icon={<IoBagCheckOutline className="text-2xl text-purple-500" />}
                component={<Link to="/checkout" />}
              >
                Thanh toán
              </MenuItem>
              <MenuItem
                icon={<CiShoppingCart className="text-2xl text-blue-500" />}
                component={<Link to="/orders" />}
              >
                Đơn hàng
              </MenuItem>
            </>
          ) : (<></>)}

          {(user.role === ROLE_TYPE.STAFF) ?
            (
              <>
                <SubMenu
                  label="Sản phẩm"
                  icon={<MdProductionQuantityLimits className="text-2xl text-purple-600" />}
                >
                  <MenuItem component={<Link to="/AddProduct" />}>
                    Thêm sản phẩm
                  </MenuItem>
                  <MenuItem component={<Link to="/AllProduct" />}>
                    Tất cả sản phẩm
                  </MenuItem>
                  <MenuItem component={<Link to="/AddProductCategories" />}>
                    Thêm danh mục sản phẩm
                  </MenuItem>
                </SubMenu>

                <MenuItem
                  icon={<IoBagCheckOutline className="text-2xl text-violet-600" />}
                  component={<Link to="/staff/orders" />}
                >
                  Quản lý đơn
                </MenuItem>
              </>
            ) : (<></>)}

          {(user.role === ROLE_TYPE.ADMIN) ?
            (
              <>
                <SubMenu
                  label="Sản phẩm"
                  icon={<MdProductionQuantityLimits className="text-2xl text-orange-600" />}
                >
                  <MenuItem
                  // component={<Link to="/AdminAllProducts" />}
                  >
                    Tất cả sản phẩm
                  </MenuItem>
                </SubMenu>

                <MenuItem
                  icon={<MdBadge className="text-2xl text-orange-600" />}
                  component={<Link to="/Customers" />}
                >
                  Khách hàng
                </MenuItem>

                <MenuItem
                  icon={<MdDashboard className="text-2xl text-orange-600" />}>
                  Đơn hàng
                </MenuItem>

                <MenuItem
                  icon={<MdOutlinePersonOutline className="text-2xl text-orange-600" />}
                  component={<Link to="/Employees" />}
                >
                  Nhân viên
                </MenuItem>

                <MenuItem
                  icon={<MdOutlinePersonOutline className="text-2xl text-orange-600" />}
                >
                  Logs
                </MenuItem>
              </>
            ) : (<></>)}

          <MenuItem
            icon={<CiUser className="text-2xl text-green-600" />}
            component={<Link to="/profile" />}
          >
            Thông tin cá nhân
          </MenuItem>
        </Menu>
      </Sidebar>

      <main className="p-4 sm:p-6 lg:p-8 grow">
        <div className="bg-white/80 backdrop-blur-sm mt-5 rounded-2xl shadow-lg p-6 border border-gray-200">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default ProtectedLayout
