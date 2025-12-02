import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Export from './pages/Export'
import ChartsPage from './pages/ChartsPage'
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-50 bg-gray-950 border-r p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Amortissement</h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'p-2 rounded bg-sky-400 font-bold' : 'p-2 rounded hover:bg-sky-300 text-white font-bold'}>Accueil</NavLink>
          <NavLink to="/compare" className={({ isActive }) => isActive ? 'p-2 rounded bg-sky-400 font-bold' : 'p-2 rounded hover:bg-sky-300 text-white font-bold'}>Comparer</NavLink>
          <NavLink to="/charts" className={({ isActive }) => isActive ? 'p-2 rounded bg-sky-400 font-bold' : 'p-2 rounded hover:bg-sky-300 text-white font-bold'}>Graphiques</NavLink>
          {/* <NavLink to="/export" className={({ isActive }) => isActive ? 'p-2 rounded bg-sky-400' : 'p-2 rounded hover:bg-sky-50'}>Exporter</NavLink> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/charts" element={<ChartsPage />} />
          {/* <Route path="/export" element={<Export />} /> */}
        </Routes>
      </main>

    </div>
  )
}
