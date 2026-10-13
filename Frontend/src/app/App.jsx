import { RouterProvider } from 'react-router-dom' 
import { routes } from './app.routes'
import { useEffect } from 'react'

function App() {
 
  return (
    <RouterProvider router={routes}/>
  )
}

export default App