import React from 'react'
import { Link } from 'react-router-dom'

const CheckEmail = () => {

    const openGmail=()=>{
        window.open("https://mail.google.com")
    }

  return (
            <section className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-100 px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">

                <h1 className="text-2xl font-bold text-[#31b8c6]">
                    Check your email
                </h1>

                <p className="mt-4 text-zinc-300">
                    We've sent a verification link to your email address.
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                    Please verify your email before logging in.
                </p>

                <button
                   onClick={openGmail}
                    className="mt-6 inline-block rounded-lg bg-[#31b8c6] px-5 py-3 font-semibold text-zinc-950"
                >
                    Open Gmail
                </button>

            </div>
        </section>
  )
}

export default CheckEmail
