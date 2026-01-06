import React,{useState,useEffect} from 'react'
import flashcardService from '../../services/flashcardService'
import PageHeader from '../../Components/common/PageHeader'
import Spinner from '../../Components/common/Spinner'
import EmptyState from '../../Components/common/EmptyState'
import FlashcardSetCard from '../../Components/flashcard/FlashcardSetCard.jsx'
import toast from 'react-hot-toast'


const FlashcardListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const res = await flashcardService.getAllFlashcardSets()
        console.log("Flashcard sets:", res.data)
        setFlashcardSets(res.data || [])
      } catch (error) {
        console.error("Error fetching flashcard sets:", error)
        toast.error(error.message || "Failed to load flashcard sets")
      } finally {
        setLoading(false)
      } 
    }
    fetchFlashcardSets()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      )
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets"
          description="You haven't created any flashcard sets yet."
        />
      )
    } 



    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {flashcardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )
  }





  return (
    <div>
      <PageHeader title="All Flashcard Sets" />
        <div>{renderContent()}</div>
    </div>
  
  )
}

export default FlashcardListPage