import { useState } from 'react'
import ETFDashboard from '../pages/ETFDashboard/ETFDashboard'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import '../styles/App.css'

function App() {

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>
      <h1>ETF Price Monitor</h1>
      <p>Historical Price Viewer for ETFs</p>
      <ETFDashboard />
    </div>
  )
}

export default App
