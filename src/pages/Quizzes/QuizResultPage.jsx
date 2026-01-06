import React, { useState, useEffect, use } from 'react'
import { useParams, Link } from 'react-router-dom'
import quizService from '../../services/quizService.js'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Spinner from '../../Components/common/Spinner.jsx'
import toast from 'react-hot-toast'

import { ArrowLeft, CheckCircle, XCircle, Trophy, Target, BookOpen } from 'lucide-react'

const QuizResultPage = () => {
  const { quizId } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId)
        setResults(data)
      } catch (error) {
        toast.error(error.message || "Failed to load quiz results")
      }
      finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }


  if (!results || !results.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div>
          <p>No quiz results available.</p>
        </div>
      </div>
    )
  }

  const { data: { quiz, result: detailResults } } = results
  const score = quiz.score
  const totalQuestions = detailedResults.length
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length
  const incorrectAnswers = totalQuestions - correctAnswers

  const getScoreColor = (score) => {

    if (score >= 80) return "from-emerald-500 to-teal-500"
    if (score >= 50) return "from-amber-500 to-orange-500"
    return "from-rose-500 to-red-500"
  }






  return (
    <div>
      {/* back button> */}
      <div >
        <Link to={`/documents/${quiz.documentId}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>

      <PageHeader title={`Quiz Results: ${quiz.title}`} />

      {/* score card */}
      <div>
        <div>
          <Thrphy className={`h-6 w-6 mb-2 text-white`} />
          <h2>Your Score: {score}%</h2>
          <div className={`h-4 w-full bg-gradient-to-r ${getScoreColor(score)} rounded-full mt-2`}>
            <div className="h-4 bg-white rounded-full" style={{ width: `${score}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-slate-600">{correctAnswers} out of {totalQuestions} correct</p>
        </div>
      </div>

      {/* stat results */}
      <div className="mt-6 space-y-4">
        <Target className="h-5 w-5 text-slate-700 mb-2" >Total Questions: {totalQuestions}</Target>
      </div>
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-sm font-semibold text-emerald-800">
          <CheckCircle className="h-4 w-4" /> Correct Answers: {correctAnswers}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-3 py-1 text-sm font-semibold text-rose-800">
          <XCircle className="h-4 w-4" /> Incorrect Answers: {incorrectAnswers}
        </div>
      </div>
{/* question rreview  */}















    </div>





  )
}

export default QuizResultPage