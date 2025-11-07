import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'


const HomeView = () => {

  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      
      <div className='welcome'>
        {isAuthenticated &&
          <h2>Welcome {user.first_name} {user.last_name}!</h2>
          }
      </div>
      <SearchBar/>

    </div>
  )
}

export default HomeView