import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginUser from '@/pages/HomePage/auth/LoginUser'
import MainLayout from '@/layout/MainLayout'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' Component={MainLayout} />
        <Route index Component={HomePage} />
        <Route path='/login' Component={LoginUser} />
      </Routes>
    </>
  )
}

export default App