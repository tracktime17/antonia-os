'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupOk, setSignupOk] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      router.push('/')
      router.refresh()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      setSignupOk(true)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Antonia OS</h1>
      <p className="mt-1 text-neutral-500">
        {mode === 'signin' ? 'Inicia sesión' : 'Crea tu cuenta'}
      </p>

      {signupOk ? (
        <p className="mt-6 text-neutral-700">
          Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-neutral-300 py-2 outline-none focus:border-neutral-900"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-neutral-300 py-2 outline-none focus:border-neutral-900"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded bg-neutral-900 py-2 text-white disabled:opacity-50"
          >
            {loading ? '...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      )}

      <button
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError(null)
          setSignupOk(false)
        }}
        className="mt-6 text-sm text-neutral-500 underline"
      >
        {mode === 'signin' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
      </button>
    </main>
  )
}
