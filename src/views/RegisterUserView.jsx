import React from 'react'
import UserForm from '../components/UserForm/UserForm'
import { useAuth } from '../contexts/AuthContext'



const RegisterUserView = () => {
  const { registerUser } = useAuth();

  return (
    <div>
      <UserForm submitFunction = {registerUser}/>
    </div>
  )
}

export default RegisterUserView