import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Header from './conponents/Header'
const App = () => {
  return (
    <>
    <Header />
    <Routes>
      <Route path='/' Component={HomePage} />
    </Routes>
    </>
  )
}

export default App