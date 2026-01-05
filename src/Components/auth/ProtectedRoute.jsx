import React, { use } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import { useAuth } from '../../context/AuthContext.jsx'

const ProtectedRoute = () => {
  const {isAuthenticated,loading}=useAuth();

    if(loading){
        return <div>Loading...</div>
    }

  return isAuthenticated? (
    <AppLayout> <Outlet/></AppLayout>
  ):(
    <Navigate to="/login" replace/>
  )
}

export default ProtectedRoute