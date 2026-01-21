import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import LoginUser from './pages/HomePage/auth/LoginUser'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/login' Component={LoginUser} />
      </Routes>
    </>
  )
}

export default App