import React, { useState, useEffect } from 'react'
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

  const { data: { quiz, results: detailedResults } } = results
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
    <div className="space-y-6">
      <div>
        <Link to={`/documents/${quiz.document._id}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>

      <PageHeader title={`Quiz Results: ${quiz.title}`} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600/80">Score</p>
              <h2 className="text-3xl font-semibold text-slate-900">Your Score: {score}%</h2>
              <p className="mt-2 text-sm text-slate-600">{correctAnswers} out of {totalQuestions} correct</p>
            </div>
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${getScoreColor(score)} text-white flex items-center justify-center shadow-lg`}>
              <Trophy className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-3 w-full rounded-full bg-slate-100">
              <div className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(score)}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-slate-700" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <p className="text-base font-semibold text-slate-900">Performance summary</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Total questions</span>
              <span className="font-semibold text-slate-900">{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Correct answers</span>
              <span className="font-semibold text-emerald-700">{correctAnswers}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Incorrect answers</span>
              <span className="font-semibold text-rose-700">{incorrectAnswers}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
              <CheckCircle className="h-4 w-4" /> Correct: {correctAnswers}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-3 py-1 text-xs font-semibold text-rose-800">
              <XCircle className="h-4 w-4" /> Incorrect: {incorrectAnswers}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-slate-700" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Question review</h3>
            <p className="text-sm text-slate-600">Review each answer and see the correct solution.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {detailedResults.map((item, index) => (
            <div
              key={item?._id || `${item?.question || 'question'}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {index + 1}. {item?.question || "Question"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Your answer: <span className="font-semibold text-slate-900">{item?.userAnswer || "No answer"}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Correct answer: <span className="font-semibold text-emerald-700">{item?.correctAnswer || "N/A"}</span>
                  </p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${item?.isCorrect ? "bg-emerald-100/80 text-emerald-800" : "bg-rose-100/80 text-rose-800"}`}>
                  {item?.isCorrect ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Correct
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" /> Incorrect
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage
