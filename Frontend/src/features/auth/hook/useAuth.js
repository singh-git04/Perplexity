import { useDispatch } from "react-redux"
import { register, login, getMe, forgotPassword, resetPassword } from "../services/auth.api"
import { setUser, setLoading, setError } from "../auth.slice"


export function useAuth() {
    const dispatch = useDispatch()


    async function handleRegister({ username, email, password }) {

        try {
            dispatch(setLoading(true))
            const data = await register({
                username,
                email,
                password
            })

            return { success: true, data }

        } catch (error) {
            const errData = error.response?.data
            const message = errData?.message || errData?.errors?.[0]?.message || "Registration Failed"
            dispatch(setError(message))
            return {
                success: false,
                message,
                errors: errData?.errors || []
            }

        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {

        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return { success: true, data }
        } catch (error) {
            const errData = error.response?.data
            const message = errData?.message || errData?.errors?.[0]?.message || "Login Failed"
            dispatch(setError(message))
            return {
                success: false,
                message,
                errors: errData?.errors || []
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetech user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleForgotPassword({ email }) {
        try {
            dispatch(setLoading(true))
            const data = await forgotPassword({ email })
            return { success: true, data, message: data?.message }
        } catch (error) {
            const errData = error.response?.data
            const message = errData?.message || errData?.errors?.[0]?.message || "Failed to process request"
            dispatch(setError(message))
            return {
                success: false,
                message,
                errors: errData?.errors || []
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleResetPassword({ token, password }) {
        try {
            dispatch(setLoading(true))
            const data = await resetPassword({ token, password })
            return { success: true, data, message: data?.message }
        } catch (error) {
            const errData = error.response?.data
            const message = errData?.message || errData?.errors?.[0]?.message || "Failed to reset password"
            dispatch(setError(message))
            return {
                success: false,
                message,
                errors: errData?.errors || []
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister, handleLogin, handleGetMe, handleForgotPassword, handleResetPassword
    }

}