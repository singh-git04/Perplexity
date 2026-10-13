import { Router } from "express"
import { getMe, login, register, verifyEmail, forgotPassword, resetPassword, logout } from "../controller/auth.controller.js"
import { authUser } from '../middleware/authUser.middleware.js'
import { registerValidator, forgotPasswordValidator, resetPasswordValidator } from "../validation/authValidator.js"

const authRouter = Router()

/* 
    post /api/auth/register
*/
authRouter.post('/register', registerValidator, register)

/* 
    post /api/auth/login
*/
authRouter.post('/login', login)

/* 
    post /api/auth/logout
*/
authRouter.post('/logout', logout)

/* 
    get /api/auth/get-me
*/
authRouter.get('/get-me', authUser, getMe)

authRouter.get('/verify-email', verifyEmail)

/* 
    post /api/auth/forgot-password
*/
authRouter.post('/forgot-password', forgotPasswordValidator, forgotPassword)

/* 
    post /api/auth/reset-password
*/
authRouter.post('/reset-password', resetPasswordValidator, resetPassword)

export default authRouter