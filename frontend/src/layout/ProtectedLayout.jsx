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
import { MdDashboard, MdProductionQuantityLimits } from 'react-icons/md'
import { ROLE_TYPE } from '@/constant/auth.constant'

const ProtectedLayout = () => {
  const user = useSelector(UserSlicePath)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { isToggle, isCollapse } = useSelector(
    state => SidebarSlicePath(state) || { isToggle: false, isCollapse: false }
  )

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
    <div className="flex items-start bg-orange-50 min-h-screen">
      <Sidebar
        toggled={isToggle}
        collapsed={isCollapse}
        onBackdropClick={() => dispatch(setToggle())}
        breakPoint="md"
        rootStyles={{
          backgroundColor: '#FFEDD5', // bg-orange-100
          color: '#7C2D12', // text-orange-900-ish
          borderRight: '1px solid #FED7AA', // border-orange-200
        }}
      >
        <Menu
          className="h-[80vh] border-none"
          menuItemStyles={{
            button: {
              padding: '10px 16px',
              color: '#7C2D12',
              '&:hover': {
                backgroundColor: '#FED7AA', // orange-200
                color: '#7C2D12',
              },
              '&.active': {
                backgroundColor: '#FB923C', // orange-400
                color: '#FFFFFF',
              },
            },
            icon: {
              color: '#EA580C', // orange-600
              fontSize: '1.5rem',
            },
          }}
        >
          <MenuItem
            icon={<MdDashboard className="text-2xl text-orange-600" />}
            component={<Link to="/dashboard" />}
          >
            Quản lý
          </MenuItem>

          {user.role === ROLE_TYPE.CUSTOMER ? (
            <>
              <MenuItem
                icon={<IoMdHeartEmpty className="text-2xl text-orange-500" />}
                component={<Link to="/wishlist" />}
              >
                Yêu thích
              </MenuItem>
              <MenuItem
                icon={<IoBagCheckOutline className="text-2xl text-orange-500" />}
                component={<Link to="/checkout" />}
              >
                Thanh toán
              </MenuItem>
              <MenuItem
                icon={<CiShoppingCart className="text-2xl text-orange-500" />}
                component={<Link to="/orders" />}
              >
                Đơn hàng
              </MenuItem>
            </>
          ) : (
            <>
              <SubMenu
                label="Products"
                icon={<MdProductionQuantityLimits className="text-2xl text-orange-600" />}
              >
                <MenuItem component={<Link to="/AddProduct" />}>
                  Thêm sản phẩm
                </MenuItem>
                <MenuItem component={<Link to="/AllProduct" />}>
                  Tất cả sản phẩm
                </MenuItem>
              </SubMenu>
            </>
          )}

          <MenuItem
            icon={<CiUser className="text-2xl text-orange-600" />}
            component={<Link to="/profile" />}
          >
            Thông tin cá nhân
          </MenuItem>
        </Menu>
      </Sidebar>

      <main className="px-4 w-full">
        <div className="bg-white mt-5 rounded-lg shadow-sm p-4 border border-orange-100">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default ProtectedLayout
