import React from 'react'
import Header from '@/components/Header'
import ChatBot from '@/components/ChatBot'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
        <Header/>
        <Outlet/>
        <ChatBot/>
    </>
  )
}

export default MainLayout