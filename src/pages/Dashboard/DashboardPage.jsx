import React, { useState, useEffect, use } from 'react'
import Spinner from '../../Components/common/Spinner'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from 'lucide-react'

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboard()
        console.log("Dashboard data:", data)
        setDashboardData(data)

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
    return <Spinner />
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

  const stats=[
    {label:"Total Documents",value:dashboardData.overview.totalDocuments,icon:FileText,gradient:"from-purple-500 to-indigo-600",shadowColor:"shadow-purple-200/50"},
    {label:"Total Flashcards",value:dashboardData.overview.totalFlashcards,icon:BookOpen, gradient:"from-emerald-500 to-teal-600",shadowColor:"shadow-emerald-200/50"},
    {label:"Total Quizzes ",value:dashboardData.overview.totalQuizzes,icon:TrendingUp, gradient:"from-yellow-500 to-orange-600",shadowColor:"shadow-yellow-200/50"},

  ]

    return (
      <div>DashboardPage</div>
    )
  }
  export default DashboardPage