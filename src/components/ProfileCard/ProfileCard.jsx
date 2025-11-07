import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './ProfileCard.css'
import { useTheme } from '../../contexts/ThemeContext';

const ProfileCard = () => {
  const { user,  deleteUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme(); 

  const handleDelete = () => {
     deleteUser();
     navigate('/')
  }

  return (
    <div className={darkMode ? 'container mainDark' : 'container mainLight'}>
      <div className='profile-card'>
        {/* <h1>Profile Page</h1> */}
        <h2 className='profile-name'>{user?.first_name} {user?.last_name}</h2>
        <div />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div className='profile-list'>
            <p>EMAIL: {user?.email}</p>
            <p>STATUS: {user?.role}</p>
          </div>
          <div className='profile-buttons'>
            <button className='update-button' onClick={()=>navigate('/profile/update')}>Update</button>
            <button className='delete-button' onClick={()=>handleDelete()}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard