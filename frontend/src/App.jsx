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

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage/>} />

          <Route element={<ProtectedLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileUser />} />
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