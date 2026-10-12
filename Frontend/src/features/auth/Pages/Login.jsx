import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import loginValidation from '../validaton/login.validation';

const Login = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  

  async function handleSubmit(e) {
    e.preventDefault()
    if(loading) return;
    setGeneralError('')

    const validationErrors = loginValidation({email,password})
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      email: email.trim(),
      password: password
    }

    const result = await handleLogin(payload)

    if (result?.success || result === true) {
      navigate('/')
    } else {
      if (result?.errors && result.errors.length > 0) {
        const backendFieldErrors = {}
        result.errors.forEach(err => {
          if (err.field && !backendFieldErrors[err.field]) {
            backendFieldErrors[err.field] = err.message
          }
        })
        setErrors(backendFieldErrors)
      }
      if (result?.message) {
        setGeneralError(result.message)
      }
    }
  }

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center'>
        <div className='w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl'>
          <h1 className='text-3xl font-bold text-[#31b8c6]'>
            Welcome Back
          </h1>
          <p className='mt-2 text-sm text-zinc-300'>
            Sign in with email and password
          </p>

          {generalError && (
            <div className='mt-6 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className='mt-8 space-y-5'>
            <div>
              <label htmlFor="email" className='mb-2 block text-sm font-medium text-zinc-200'>
                Email
              </label>
              <input
                onChange={e => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                  if (generalError) setGeneralError('')
                }}
                id='email'
                type='email'
                value={email}
                autoComplete='email'
                placeholder='you@example.com'
                className={`w-full rounded-lg border bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none transition ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.25)]'
                    : 'border-zinc-700 focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'
                }`}
              />
              {errors.email && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label htmlFor="password" className='block text-sm font-medium text-zinc-200'>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className='text-xs font-medium text-[#31b8c6] transition hover:text-[#45c7d4]'
                >
                  Forgot password?
                </Link>
              </div>
              <input
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                  if (generalError) setGeneralError('')
                }}
                id='password'
                type='password'
                value={password}
                autoComplete='current-password'
                placeholder='Enter your Password'
                className={`w-full rounded-lg border bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none transition ${
                  errors.password
                    ? 'border-rose-500/80 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.25)]'
                    : 'border-zinc-700 focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'
                }`}
              />
              {errors.password && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-zinc-100'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
