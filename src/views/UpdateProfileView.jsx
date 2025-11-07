import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import UserForm from '../components/UserForm/UserForm';

const UpdateProfileView = () => {
    const { updateUser } = useAuth();

  return (
    <div>
        <h3>Please update below! </h3>
        <UserForm submitFunction = {updateUser}/>
    </div>
  )
}

export default UpdateProfileView