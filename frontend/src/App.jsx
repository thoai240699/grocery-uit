import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginUser from '@/pages/HomePage/auth/LoginUser'
import MainLayout from '@/layout/MainLayout'
import RegisterUser from './pages/HomePage/auth/RegisterUser'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthLayout from './layout/AuthLayout'
import Dashboard from './pages/Dashboard'
import CartPage from './pages/CartPage'
import ProtectedLayout from './layout/ProtectedLayout'
import ProfileUser from './pages/ProfileUser'
import AddProduct from './pages/Products/AddProduct'
import AddProductCategories from './pages/Products/AddProductCategories'
import AllProducts from './pages/Products/AllProduct'
import RoleLayout from './layout/RoleLayout'
import ChatPage from './pages/ChatPage'
import ProductPage from './pages/ProductPage'
import AdminAllProducts from './pages/Products/AdminAllProduct'
import Employees from './pages/EmployeePage'
import Customers from './pages/CustomerPage'
import WishList from './pages/WishListPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/CheckoutPage/SuccessPage'
import FailedPage from './pages/CheckoutPage/FailedPage'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path='product/:slug' element={<ProductPage />} />

          <Route element={<ProtectedLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileUser />} />

            <Route element={<RoleLayout role={"customer"} />} >
              <Route path="wishlist" element={<WishList />} />
              <Route path='checkout' element={<CheckoutPage />} />
              <Route path='checkout/success' element={<SuccessPage />} />
              <Route path='checkout/failed' element={<FailedPage />} />
            </Route>

            <Route element={<RoleLayout role={"staff"} />}>
              <Route path="AddProduct" element={<AddProduct />} />
              <Route path="AddProductCategories" element={<AddProductCategories />} />
              <Route path="AllProduct" element={<AllProducts />} />
            </Route>

            <Route element={<RoleLayout role={"admin"} />}>
              <Route path="AdminAllProduct" element={<AdminAllProducts />} />
              <Route path="Employees" element={<Employees />} />
              <Route path="Customers" element={<Customers />} />
            </Route>

          </Route>

        </Route>
        <Route element={<AuthLayout />} >
          <Route path='/login' element={<LoginUser />} />
          <Route path='/register' element={<RegisterUser />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App