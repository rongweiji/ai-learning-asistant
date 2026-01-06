import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles, TrendingUp, Clock, BookMarked } from 'lucide-react'
import moment from 'moment'

const FlashcardSetCard = ({ flashcardSet }) => {

    const navigate = useNavigate()
    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`)
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length
    const totalCards = flashcardSet.cards.length
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0




    return (
        <article
            onClick={handleStudyNow}
            className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 inline-flex items-center gap-2">
                            <BookMarked className="h-4 w-4" /> Flashcard Set
                        </p>
                        <h3
                            className="text-lg font-semibold text-slate-900 truncate"
                            title={flashcardSet.documentId?.title || flashcardSet.document?.title || flashcardSet.title || 'Untitled set'}
                        >
                            {flashcardSet.documentId?.title || flashcardSet.document?.title || flashcardSet.title || 'Untitled set'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            Created {flashcardSet.createdAt ? moment(flashcardSet.createdAt).fromNow() : 'Recently created'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2">
                    <p className="text-slate-500 text-sm">Cards</p>
                    <p className="text-xl font-semibold text-slate-900">{totalCards}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2">
                    <p className="text-slate-500 text-sm">Reviewed</p>
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>{progressPercentage}%</span>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Study progress</span>
                    <span className="font-semibold text-slate-900">{reviewedCount}/{totalCards} reviewed</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all"
                        style={{ width: `${progressPercentage}%` }}
                        aria-label="Flashcard review progress"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-sm text-slate-600">
                    {progressPercentage === 100 ? 'Great job! All cards reviewed.' : 'Keep the streak going.'}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleStudyNow()
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                    <Sparkles className="h-4 w-4" />
                    Study now
                </button>
            </div>
        </article>
    )
}

export default FlashcardSetCard