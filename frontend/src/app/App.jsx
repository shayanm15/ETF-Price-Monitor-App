import { useState } from 'react'
import ETFDashboard from '../pages/ETFDashboard/ETFDashboard'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import '../styles/App.css'
import './App.css';

function App() {

  return (
    <div className="appContainer">
      <h1>ETF Price Monitor</h1>
      <p>Historical Price Viewer for ETFs</p>
      <ETFDashboard />
    </div>
  )
}

export default App
