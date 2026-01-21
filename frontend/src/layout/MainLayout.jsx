import React from 'react'
import Headers from '@/components/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
        <Headers/>
        <Outlet/>
    </>
  )
}

export default MainLayout