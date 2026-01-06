import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment'

const QuizCard = ({ quiz, onDelete }) => {

    const hasAttempts = (quiz?.userAnswer?.length ?? 0) > 0
    const questionCount = quiz?.questions?.length ?? 0
    const createdLabel = quiz?.createdAt ? moment(quiz.createdAt).fromNow() : 'Recently created'
    const title = quiz?.title || (quiz?.createdAt ? `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}` : 'Untitled quiz')
    const scoreLabel = typeof quiz?.score === 'number' ? `${quiz.score}%` : hasAttempts ? 'Completed' : 'Not taken yet'

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

            <div className="p-4 sm:p-5 flex flex-col h-full gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-100">
                                <Award className="h-4 w-4" />
                                {scoreLabel}
                            </span>
                            <span className="text-slate-500">{createdLabel}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 truncate" title={title}>
                            {title}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.(quiz)
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100"
                        aria-label="Delete quiz"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-slate-100 bg-white/70 px-3 py-2">
                        <p className="text-slate-500">Questions</p>
                        <p className="text-lg font-semibold text-slate-900">{questionCount}</p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-white/70 px-3 py-2">
                        <p className="text-slate-500">Status</p>
                        <div className="flex items-center gap-2 text-slate-900 font-semibold">
                            <BarChart2 className="h-4 w-4 text-emerald-600" />
                            <span>{hasAttempts ? 'Attempted' : 'Not attempted'}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">Last updated {createdLabel}</div>

                    {hasAttempts ? (
                        <Link
                            to={`/quizzes/${quiz._id}/results`}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <BarChart2 className="h-4 w-4" />
                            View Results
                        </Link>
                    ) : (
                        <Link
                            to={`/quizzes/${quiz._id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            <Play className="h-4 w-4" />
                            Start Quiz
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuizCard