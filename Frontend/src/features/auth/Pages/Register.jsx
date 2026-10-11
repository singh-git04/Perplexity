import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';

const Register = () => {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const loading = useSelector((state)=>state.auth.loading)


const {handleRegister} = useAuth()
const navigate = useNavigate()

async function handleSubmit(e){
  e.preventDefault()
  
  const payload = {
    username,
    email,
    password
  }

  const success = await handleRegister(payload)

  if(success===true){
    navigate('/verify-email')
  }
}

  return (
    <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center' >
        <div className='w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur'>
          <h1 className='text-3xl font-bold text-[#31b8c6]'
          >Create account</h1>
            <p className='mt-2 text-sm text-zinc-300'
            >Register with your username, email, password</p>


            <form onSubmit={handleSubmit}
            className='mt-8 space-y-5'>

              <div>
                <label htmlFor="username" className='mb-2 block text-sm font-medium text-zinc-200'>
                  Username
                </label>
                <input onChange={e=>{
                   setUsername(e.target.value)
                }}
                id='username'
                type="text"
                value={username}
                placeholder='Enter username'
                required
                className='w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'
                />
              </div>

              <div>
                <label htmlFor="email" className='mb-2 block text-sm font-medium text-zinc-200'>
                  Email
                </label>
                <input onChange={e=>{
                    setEmail(e.target.value)
                }}
                type="email"
                value={email}
                placeholder='you@example.com' 
                 required
                className='w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'/>
              </div>

              <div>
                <label htmlFor="Password" className='mb-2 block text-sm font-medium text-zinc-200'>
                  Password
                </label>
                <input onChange={e=>{
                  setPassword(e.target.value)
                }}
                type="password"
                value={password} 
                placeholder='Enter password'
                 required
                className='w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'
                />
              </div>

              <button
              type='submit'
              className='w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-900 hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)]'
              >Register</button>

              <p
              className='mt-6 text-center text-sm text-zinc-300'
              >Already have account?{' '}
                <Link to='/login' className='font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]'>Login</Link>
              </p>
            </form>
        </div>
      </div>
    </section>
  )
}

export default Register
