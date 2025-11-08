import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'
import { useLocationData } from '../contexts/LocationDataContext';


const HomeView = () => {

  const { user, isAuthenticated } = useAuth();  // use for list later
  const {tempCountyNameMap} = useLocationData();


  return (
    <div>
      <SearchBar/>
      {tempCountyNameMap &&
        <div>
          <h2>{tempCountyNameMap.county_name} (FIPS: {tempCountyNameMap.fips_id})</h2>
          {isAuthenticated ? 'clickable heart' : 'blank heart'}
        </div>
      }
    </div>
  )
}

export default HomeView