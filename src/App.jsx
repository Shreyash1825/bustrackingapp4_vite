import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Page_index from './pages/index.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page_index />} />
    </Routes>
  )
}