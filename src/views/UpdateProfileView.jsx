import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import UserForm from '../components/UserForm/UserForm';
import { useNavigate } from 'react-router-dom';

const UpdateProfileView = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdateRedirect = () => {
    navigate('/profile')
  }

  return (
    <div>
        <UserForm submitFunction = {updateUser} onSuccessRedirect={handleUpdateRedirect}/>
    </div>
  )
}

export default UpdateProfileView