import React, { useState } from 'react'
import { Star, RotateCcw, Sparkles } from 'lucide-react'


const Flashcard = ({ flashcard, onToggleStar }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped((prev) => !prev)
    }

    const handleStar = (e) => {
        e.stopPropagation()
        if (onToggleStar) {
            onToggleStar(flashcard._id)
        }
    }

    const getDifficultyStyles = (difficulty) => {
        const level = difficulty?.toLowerCase() || 'medium'
        const styles = {
            easy: 'bg-green-100 text-green-700 ring-green-200',
            medium: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
            hard: 'bg-red-100 text-red-700 ring-red-200'
        }
        return styles[level] || styles.medium
    }

    return (
        <div className="relative w-full h-72 flex items-center justify-center" style={{ perspective: '1200px' }}>
            <div
                role="button"
                tabIndex={0}
                onClick={handleFlip}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
                className="relative h-full w-1/3 cursor-pointer transition-transform duration-500 transform-gpu"
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* front */}
                <div
                    className="absolute inset-0 rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50 to-white p-5 shadow-md"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                            <Sparkles className="h-4 w-4" /> Question
                        </div>
                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getDifficultyStyles(flashcard.difficulty)}`}>
                            {flashcard.difficulty?.charAt(0).toUpperCase() + flashcard.difficulty?.slice(1) || 'Medium'}
                        </div>
                        <button
                            type="button"
                            onClick={handleStar}
                            aria-label={flashcard.isStarred ? 'Unstar flashcard' : 'Star flashcard'}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-400 shadow-sm ring-1 ring-amber-100 transition hover:-translate-y-0.5 hover:shadow"
                        >
                            <Star className={`h-5 w-5 ${flashcard.isStarred ? 'fill-amber-400' : 'text-amber-300'}`} />
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        <p className="text-base font-semibold text-slate-900 leading-relaxed">
                            {flashcard.question}
                        </p>
                        <p className="text-sm text-slate-500">Tap or press Enter to flip</p>
                    </div>

                    <div className="absolute inset-x-5 bottom-4 flex items-center justify-end text-xs font-semibold text-emerald-700">
                        <RotateCcw className="h-4 w-4 mr-2 text-emerald-500" />
                        Reveal answer
                    </div>
                </div>

                {/* back */}
                <div
                    className="absolute inset-0 rotateY-180 rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 p-5 text-white shadow-md"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                            <Sparkles className="h-4 w-4" /> Answer
                        </div>
                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getDifficultyStyles(flashcard.difficulty)}`}>
                            {flashcard.difficulty?.charAt(0).toUpperCase() + flashcard.difficulty?.slice(1) || 'Medium'}
                        </div>
                        <button
                            type="button"
                            onClick={handleStar}
                            aria-label={flashcard.isStarred ? 'Unstar flashcard' : 'Star flashcard'}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-amber-200 shadow-sm ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/15"
                        >
                            <Star className={`h-5 w-5 ${flashcard.isStarred ? 'fill-amber-300 text-amber-300' : 'text-amber-100'}`} />
                        </button>
                    </div>

                    <div className="mt-4 h-full space-y-3">
                        <p className="text-base font-semibold leading-relaxed text-white/90">
                            {flashcard.answer}
                        </p>
                        <p className="text-sm text-white/70">Tap or press Enter to flip back</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Flashcard
