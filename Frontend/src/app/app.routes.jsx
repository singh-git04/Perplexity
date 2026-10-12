import { createBrowserRouter } from "react-router"
import Login from "../features/auth/Pages/Login"
import Register from "../features/auth/Pages/Register"
import Dashboard from "../features/chat/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import VerifyEmail from "../features/auth/Pages/VerifyEmail"
import CheckEmail from "../features/auth/Pages/CheckEmail"
import ForgotPassword from "../features/auth/Pages/ForgotPassword"
import ResetPassword from "../features/auth/Pages/ResetPassword"

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
        path: '/forgot-password',
        element: <ForgotPassword/>
    },
    {
        path: '/reset-password',
        element: <ResetPassword/>
    },
    {
        path: '/check-email',
        element:<CheckEmail/>
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