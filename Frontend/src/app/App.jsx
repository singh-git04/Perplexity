import { RouterProvider } from 'react-router-dom' 
import { routes } from './app.routes'
import { useEffect } from 'react'
import { useAuth } from '../features/auth/hook/useAuth'

function App() {
 const auth = useAuth()

 useEffect(()=>{
  auth.handleGetMe()
 },[])
  return (
    <RouterProvider router={routes}/>
  )
}

export default App