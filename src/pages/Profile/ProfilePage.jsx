import React, { useEffect, useState } from 'react'
import { Mail, User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import Spinner from '../../Components/common/Spinner'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState({ username: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const response = await authService.getProfile()
        const data = response?.data || response?.user || response || {}
        const nextProfile = {
          username: data.username || user?.username || '',
          email: data.email || user?.email || '',
        }
        setProfile(nextProfile)
        updateUser(nextProfile)
      } catch (error) {
        toast.error(error.message || 'Failed to load profile')
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    setSavingPassword(true)
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      toast.success('Password updated')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const handlePasswordInput = (key, value) => {
    setPasswords((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">Manage your account details and password.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Account information</h2>
              <p className="text-sm text-slate-600">Your username and email.</p>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-xl border bg-slate-50 pl-11 pr-4 py-3 text-slate-900 shadow-sm border-slate-200"
                      value={profile.username}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      className="w-full rounded-xl border bg-slate-50 pl-11 pr-4 py-3 text-slate-900 shadow-sm border-slate-200"
                      value={profile.email}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
              <p className="text-sm text-slate-600">Use a strong, unique password.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Current password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className="w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border-slate-200"
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordInput('currentPassword', e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">New password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className="w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border-slate-200"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordInput('newPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Confirm new password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex pl-4 items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className="w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border-slate-200"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordInput('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingPassword ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage