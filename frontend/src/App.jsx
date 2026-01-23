import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginUser from '@/pages/HomePage/auth/LoginUser'
import MainLayout from '@/layout/MainLayout'
import RegisterUser from './pages/HomePage/auth/RegisterUser'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path='/login' element={<LoginUser />} />
        <Route path='/register' element={<RegisterUser />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App