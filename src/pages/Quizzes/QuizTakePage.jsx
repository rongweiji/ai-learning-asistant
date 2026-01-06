import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import quizService from '../../services/quizService.js'
import toast from 'react-hot-toast'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Button from '../../Components/common/Button.jsx'
import Spinner from '../../Components/common/Spinner.jsx'


const QuizTakePage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId)
        setQuiz(res.data)

      } catch (error) {
        toast.error(error.message || "Failed to load quiz")
        console.error("Error fetching quiz:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }


  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  };


  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  };


  const handleSubmitQuiz = async () => {
    setSubmitting(true)
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question=quiz.questions.find(q=>q._id===questionId)
        const questionIndex=quiz.questions.findIndex(q=>q._id===questionId)
        const optionIndex=selectedAnswers[questionId]
        const selectedAnswer=question.options[optionIndex]
        return {questionIndex,selectedAnswer}
      })
      await quizService.submitQuiz(quizId, { answers: formattedAnswers })
      toast.success("Quiz submitted successfully")
      navigate(`/quizzes/${quizId}/results`)
    } catch (error) {
      toast.error(error.message || "Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }


  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner size="lg" />
      </div>
    )
  }


  if (!quiz || quiz.questions.length === 0) {
    return (
      <div>No quiz data available.</div>
    )
  }


  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id)
  const answeredCount = Object.keys(selectedAnswers).length


  return (
    <div>
      <PageHeader title={`Taking Quiz: ${quiz.title}`} />
      {/* progress bar  */}
      <div>
        <span>
          Question {currentQuestionIndex + 1} of {quiz.questions.length} (Answered: {answeredCount})
        </span>
      </div>

      {/* question card  */}
      <div >
        <div>
          <span>Question {currentQuestionIndex + 1}: {currentQuestion.text}</span>
        </div>
      </div>



      {/* options  */}
      <div >
        {currentQuestion.options.map((option) => (
          <div key={option._id}>
            <label >
              <input

                type="radio"
                name={`question-${currentQuestion._id}`}
                value={option._id}
                checked={selectedAnswers[currentQuestion._id] === option._id}
                onChange={() => handleOptionChange(currentQuestion._id, option._id)}
              />
              <span>{option.text}</span>
            </label>
          </div>
        ))}


        {/* navigation buttons */}
        <div >
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length !== quiz.questions.length || submitting}
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* question navigation dots */}

      <div >
        {quiz.questions.map((question, index) => {
          const isCurrent = index === currentQuestionIndex
          const isAnswered = selectedAnswers.hasOwnProperty(question._id)
          return (
            <button
              key={question._id}
              onClick={() => setCurrentQuestionIndex(index)}
            >

              <span >
                {index + 1}
              </span>
            </button>
          )
        })}




      </div>
    </div>


  )
}

export default QuizTakePage