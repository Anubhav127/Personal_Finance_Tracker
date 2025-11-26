import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index'
import './App.css'

function App() {
  
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
