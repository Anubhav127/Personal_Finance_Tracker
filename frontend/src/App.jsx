import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import {router} from './routes/index'
import './App.css'

function App() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  )
}

export default App
