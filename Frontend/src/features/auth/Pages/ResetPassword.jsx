import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import resetPasswordValidation from '../validaton/resetPassword.validation'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { handleResetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    if (isSubmitting || !token) return

    setGeneralError('')

    const validationErrors = resetPasswordValidation({ password, confirmPassword })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await handleResetPassword({
        token,
        password: password.trim()
      })

      if (result?.success) {
        setIsSuccess(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  // Missing or empty token state
  if (!token) {
    return (
      <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
        <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center'>
          <div className='w-full max-w-md rounded-2xl border border-rose-500/40 bg-zinc-900/70 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-2xl'>
            <h1 className='text-2xl font-bold text-rose-400'>
              Invalid Reset Link
            </h1>
            <p className='mt-3 text-sm text-zinc-300'>
              This password reset link is invalid or missing a token. Please request a new reset link.
            </p>
            <Link
              to='/forgot-password'
              className='mt-6 inline-block rounded-lg bg-[#31b8c6] px-5 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4]'
            >
              Request New Link
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Success state after resetting password
  if (isSuccess) {
    return (
      <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
        <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center'>
          <div className='w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-2xl'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#31b8c6]/20 text-[#31b8c6]'>
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-[#31b8c6]'>
              Password Reset Successfully!
            </h1>
            <p className='mt-3 text-sm text-zinc-300'>
              Your password has been updated. You can now log in with your new password.
            </p>
            <Link
              to='/login'
              className='mt-6 inline-block w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4]'
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8'>
      <div className='mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center'>
        <div className='w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl'>
          <h1 className='text-3xl font-bold text-[#31b8c6]'>
            Reset Password
          </h1>
          <p className='mt-2 text-sm text-zinc-300'>
            Please enter your new password below.
          </p>

          {generalError && (
            <div className='mt-6 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className='mt-8 space-y-5'>
            <div>
              <label htmlFor='password' className='mb-2 block text-sm font-medium text-zinc-200'>
                New Password
              </label>
              <input
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                  if (generalError) setGeneralError('')
                }}
                id='password'
                type='password'
                value={password}
                autoComplete='new-password'
                placeholder='Enter new password'
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none transition disabled:opacity-60 ${
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

            <div>
              <label htmlFor='confirmPassword' className='mb-2 block text-sm font-medium text-zinc-200'>
                Confirm New Password
              </label>
              <input
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                  if (generalError) setGeneralError('')
                }}
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                autoComplete='new-password'
                placeholder='Confirm new password'
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none transition disabled:opacity-60 ${
                  errors.confirmPassword
                    ? 'border-rose-500/80 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.25)]'
                    : 'border-zinc-700 focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]'
                }`}
              />
              {errors.confirmPassword && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isSubmitting ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-zinc-300'>
            Remember your password?{' '}
            <Link to='/login' className='font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]'>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword
