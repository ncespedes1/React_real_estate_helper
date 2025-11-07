import React from 'react'
import UserForm from '../components/UserForm/UserForm'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';



const RegisterUserView = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/login')
  }

  return (
    <div>
      <UserForm submitFunction = {registerUser} onSuccessRedirect={handleRegisterRedirect}/>
    </div>
  )
}

export default RegisterUserView