import { createBrowserRouter } from "react-router"
import Login from "../features/auth/Pages/Login"
import Register from "../features/auth/Pages/Register"
import Dashboard from "../features/chat/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import VerifyEmail from "../features/auth/Pages/VerifyEmail"

export const routes = createBrowserRouter([
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path: '/verify-email',
        element:<VerifyEmail/>
    },
    {
        path: '/',
        element: <Protected><Dashboard/></Protected>
    }
])