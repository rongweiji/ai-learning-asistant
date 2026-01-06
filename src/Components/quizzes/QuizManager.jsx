import React,{useState,useEffect} from 'react'
import {Plus,Trash2} from 'lucide-react'
import toast from 'react-hot-toast'

import quizService from '../../services/quizService.js'
import aiService from '../../services/aiService.js'
import Spinner from '../common/Spinner.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import QuizCard from './QuizCard.jsx'


const QuizManager = () => {
  return (
    <div>QuizManager</div>
  )
}

export default QuizManager