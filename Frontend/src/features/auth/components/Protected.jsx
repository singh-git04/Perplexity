import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import {Navigate} from "react-router-dom"
import { useAuth } from '../hook/useAuth'

export const Protected = ({children}) => {
    const user = useSelector((state)=> state.auth.user)
    const loading = useSelector((state)=>state.auth.loading)

    const {handleGetMe} = useAuth()
    const [checking, setchecking] = useState(true)


 useEffect(()=>{
    if(!user){
        handleGetMe().finally(()=> setchecking(false))
    }  else{
        setchecking(false)
    }
 },[])
    

    if (checking || loading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0b0d0f] text-zinc-400">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-14 w-14 rounded-2xl bg-white/10 animate-ping" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white font-bold text-xl text-black shadow-2xl shadow-cyan-500/20">
                        P
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Loading workspace...</span>
                </div>
            </div>
        )
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
