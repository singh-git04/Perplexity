import {useDispatch} from "react-redux"
import { register, login, getMe } from "../services/auth.api"
import { setUser, setLoading, setError } from "../auth.slice"


export function useAuth(){
    const dispatch = useDispatch()


    async function handleRegister({username, email, password}) {
        
        try {
            dispatch(setLoading(true))
            const data = await register({
                username,
                email,
                password
            })

            return true 

        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message || "Registration Failed"
                )
            ) 
            return false

        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}) {
        
        try {
            dispatch(setLoading(true))
            const data = await login({email, password})
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login Failed"))
        }finally{
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
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister, handleLogin, handleGetMe
    }

}