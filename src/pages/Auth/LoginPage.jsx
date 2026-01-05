import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import authService from '../../services/authService.js'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed, please check your credentials");
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl space-y-6">
          {/* Header inside the card */}
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BrainCircuit className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600/80">AI Learning Assistant</p>
              <h1 className="text-3xl font-semibold">Welcome back</h1>
              <p className="text-slate-600">Sign in to continue your journey.</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Email Address</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none transition-colors duration-200 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Mail className="h-4 w-4" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${focusedField === 'email' ? 'border-emerald-500/60' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Password</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Lock className="h-4 w-4" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${focusedField === 'password' ? 'border-emerald-500/60' : 'border-slate-200'}`}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* error message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign in <ArrowRight className="h-4 w-4" strokeWidth={2.5} /></span>
              )}
            </button>

            {/* footer  */}
            <div className="flex items-center justify-start text-sm text-slate-600">
              <span>
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-600 hover:text-emerald-500 font-semibold">
                  Sign up
                </Link>
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage;