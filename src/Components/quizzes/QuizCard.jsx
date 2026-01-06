import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment'

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className=''>
            <button onClick={(e) => { e.stopPropagation(); onDelete(quiz) }}>
                <Trash2 className='h-5 w-5 text-red-500 hover:text-red-700' />

            </button>


            {/* status badge */}
            <div className='absolute top-3 left-3'>
                <div>
                    <div>
                        <Award className='h-5 w-5 text-amber-400' />
                        <span  >Score:{quiz.score}</span>
                    </div>
                </div>

                <div>
                    <h3 className='' title={quiz.title}>
                        {quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
                    </h3>
                    <p >
                        Created {moment(quiz.createdAt).fromNow()}
                    </p>
                </div>

                {/* Quiz Info */}
                <div >
                    <div>
                        <div>
                            <span>
                                {quiz.questions.length}{" "}
                                {quiz.questions.length === 1 ? "question" : "questions"}
                            </span>
                        </div>
                    </div>
                </div>


                {/* Actions */}
                <div className=''>
                    {quiz.userAnswers?.length>0? (
                        <Link
                            to={`/quizzes/${quiz._id}/results`}
                            
                            className=''>
                            <BarChart2 className='h-5 w-5 mr-2' />
                            View Results
                            </Link>
                            ) : (
                        <Link
                            to={`/quizzes/${quiz._id}/take`}
                            className=''>
                            <Play className='h-5 w-5 mr-2' />
                            Start Quiz
                        </Link>
                    )}
                </div>


            </div>

            )
}

            export default QuizCard