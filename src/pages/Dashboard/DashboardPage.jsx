import React, { useState, useEffect } from 'react'
import Spinner from '../../Components/common/Spinner'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { FileText, BookOpen, TrendingUp, Clock, FileBadge2, ClipboardCheck } from 'lucide-react'

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboard()

        setDashboardData(data.data)

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error(error.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }


  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div>
          <p>No dashboard data available.</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Total Documents", value: dashboardData.overview.totalDocuments, icon: FileText, gradient: "from-purple-500 to-indigo-600" },
    { label: "Total Flashcards", value: dashboardData.overview.totalFlashcards, icon: BookOpen, gradient: "from-emerald-500 to-teal-600" },
    { label: "Total Quizzes", value: dashboardData.overview.totalQuizzes, icon: TrendingUp, gradient: "from-yellow-500 to-orange-600" },
  ]

  const activities = [
    ...(dashboardData.recentActivities?.documents || []).map((doc) => ({
      id: doc._id,
      type: 'document',
      title: doc.title,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
    })),
    ...(dashboardData.recentActivities?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      type: 'quiz',
      title: quiz.title,
      timestamp: quiz.lastAttempt,
      link: `/quizzes/${quiz._id}`,
    })),
  ]
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Track your learning progress and recent activity.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <span className="text-xs text-slate-500">Last 5 items</span>
        </div>

        {activities.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-500">
            No recent activity yet. Engage with documents or quizzes to see them here.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {activities.map((activity) => {
              const isDoc = activity.type === 'document';
              return (
                <li key={activity.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isDoc ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {isDoc ? <FileBadge2 className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {isDoc ? 'Document:' : 'Quiz:'} <span className="font-normal text-slate-700">{activity.title}</span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DashboardPage