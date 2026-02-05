import React from 'react'
import Header from '@/components/Header'
import ChatBot from '@/components/ChatBot'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/Footer'

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <ChatBot />
      <Footer />
    </>
  )
}

export default MainLayout