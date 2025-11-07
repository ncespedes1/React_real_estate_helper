import React, { useState } from 'react'
import { useLocationData } from '../../contexts/LocationDataContext'
import './SearchBar.css'

const SearchBar = () => {

    const [county, setCounty] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (event) => {
        setError(false)
        setLoading(true)
        event.preventDefault()

        const countyDataFound = await getCountyData
        
    }

  return (
    // <div>
    <form className="searchForm" onSubmit={(e) => {handleSubmit(e)}}>
        <input type="text" placeholder="Enter county name" className="search-input"/>
        <button type="submit" className="search-button">Search</button>
    </form>
    // </div>
  )
}

export default SearchBar