import LoaderComponent from '@/components/ui/LoaderComponent'
import { UserSlicePath } from '@/redux/slice/user.slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { setToggle, SidebarSlicePath } from '@/redux/slice/sidebar.slice'
import { MdDashboard, MdProductionQuantityLimits, MdPeople, MdShoppingCart } from 'react-icons/md'
import { CiUser } from 'react-icons/ci'
import { ROLE_TYPE } from '@/constant/auth.constant'

const AdminLayout = () => {
  const user = useSelector(UserSlicePath)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { isToggle, isCollapse } = useSelector(SidebarSlicePath)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (user.role !== ROLE_TYPE.ADMIN && user.role !== ROLE_TYPE.STAFF) {
      // Redirect non-admin/staff users to regular dashboard
      navigate('/dashboard')
    } else {
      setLoading(false)
    }
  }, [user, navigate])

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50">
        <LoaderComponent />
      </div>
    )
  }

  const isAdmin = user.role === ROLE_TYPE.ADMIN

  return (
    <div className="flex items-start bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
      <Sidebar
        toggled={isToggle}
        collapsed={isCollapse}
        onBackdropClick={() => dispatch(setToggle())}
        breakPoint="md"
        rootStyles={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#FFFFFF',
          borderRight: '1px solid rgba(255,255,255,0.2)',
          transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out',
          '&.ps-collapsed': {
            '.ps-menu-label, .ps-submenu-content': {
              display: 'none',
            },
          },
        }}
      >
        {/* Admin Header */}
        <div className="p-6 border-b border-white/20 text-center">
          <h2 className="text-xl font-bold text-white mb-1">
            {isAdmin ? '👑 Admin Panel' : '👷 Staff Panel'}
          </h2>
          <p className="text-white/70 text-sm">{user.name || user.email}</p>
        </div>

        <Menu
          className="h-[70vh] border-none"
          menuItemStyles={{
            button: {
              padding: '12px 20px',
              color: 'rgba(255,255,255,0.9)',
              margin: '4px 8px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                transform: 'translateX(4px)',
              },
              '&.active': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            },
            icon: {
              color: '#FFFFFF',
              fontSize: '1.5rem',
              marginRight: '12px',
            },
            subMenuContent: {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              margin: '4px 8px',
            },
          }}
        >
          <MenuItem
            icon={<MdDashboard />}
            component={<Link to="/admin-dashboard" />}
          >
            Dashboard
          </MenuItem>

          <SubMenu
            label="Sản phẩm"
            icon={<MdProductionQuantityLimits />}
          >
            <MenuItem component={<Link to="/AllProduct" />}>
              Tất cả sản phẩm
            </MenuItem>
            <MenuItem component={<Link to="/AddProduct" />}>
              Thêm sản phẩm
            </MenuItem>
            <MenuItem component={<Link to="/AddProductCategories" />}>
              Thêm danh mục
            </MenuItem>
          </SubMenu>

          {isAdmin && (
            <>
              <MenuItem
                icon={<MdPeople />}
                component={<Link to="/admin/users" />}
              >
                Người dùng
              </MenuItem>
              
              <MenuItem
                icon={<MdShoppingCart />}
                component={<Link to="/admin/orders" />}
              >
                Đơn hàng
              </MenuItem>
            </>
          )}

          <MenuItem
            icon={<CiUser />}
            component={<Link to="/profile" />}
          >
            Thông tin cá nhân
          </MenuItem>
        </Menu>
      </Sidebar>

      <main className="p-6 flex-grow">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout