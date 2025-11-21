import { useState } from 'react'
import { api } from '../lib/api'

export default function Auth({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestOtp = async () => {
    setError(''); setLoading(true)
    try {
      const res = await api('/api/auth/request-otp', { method: 'POST', body: { phone } })
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const verifyOtp = async () => {
    setError(''); setLoading(true)
    try {
      const res = await api('/api/auth/verify-otp', { method: 'POST', body: { phone, otp } })
      localStorage.setItem('user', JSON.stringify(res))
      onLogin(res)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur text-white">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-blue-100 mb-1">Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 9876543210" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={requestOtp} disabled={loading || !phone} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded py-2 font-semibold">{loading? 'Sending...' : 'Send OTP'}</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-blue-100 mb-1">OTP</label>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 123456" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={verifyOtp} disabled={loading || !otp} className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded py-2 font-semibold">{loading? 'Verifying...' : 'Verify & Continue'}</button>
          <button onClick={()=>setStep(1)} className="w-full bg-gray-600 hover:bg-gray-500 rounded py-2 font-semibold">Back</button>
        </div>
      )}
      {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}
    </div>
  )
}
