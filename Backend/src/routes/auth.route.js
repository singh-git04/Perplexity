import { Router } from "express"
import { getMe, login, register, verifyEmail} from "../controller/auth.controller.js"
import {authUser} from '../middleware/authUser.middleware.js'
import { registerValidator } from "../validation/authValidator.js"

const authRouter = Router()

/* 
    post /api/auth/register
*/
authRouter.post('/register',registerValidator,register)

/* 
    post /api/auth/login
*/

authRouter.post('/login',login)

/* 
    get /api/auth/get-me
*/
authRouter.get('/get-me',authUser,getMe)

authRouter.get('/verify-email',verifyEmail)
export default authRouter