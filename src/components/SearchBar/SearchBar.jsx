import React, { useState } from 'react'
import { useLocationData } from '../../contexts/LocationDataContext'
import './SearchBar.css'
import { Autocomplete, createFilterOptions, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {

    const [county, setCounty] = useState(null)
    const [inputValue, setInputValue] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { allCountyNames, getCountyData } = useLocationData()


    const handleSubmit = async (event) => {
        console.log(county)
        setError(false)
        setLoading(true)
        event.preventDefault()

        //===============

        let selectedCounty = county

        // If no county selected, try to match input to first option
        if (!selectedCounty && inputValue) {
            selectedCounty = allCountyNames.find(
                (c) => c.county_name.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            setCounty(selectedCounty || null)
        }

        if (!selectedCounty) {
            setError(true)
            setLoading(false)
            return
        }

        //===============


        const countyDataFound = await getCountyData(selectedCounty.fips_id, selectedCounty.county_name)
    
        setLoading(false)
        if (countyDataFound){
            console.log(countyDataFound)
        }
        
    }

    const filterOptions = createFilterOptions({
        limit: 10,
    })

    const errorMessage = () => {
        return (
            <div  className='errorStatus' style={{display: error ? "" : "none"}}>
                <h4>Invalid county name.</h4>
            </div>
        )
    }


  return (
    <div>
        <form className="searchForm" onSubmit={(e) => handleSubmit(e)}>

            <Autocomplete className="input-autocomplete"
                
                // freeSolo
                id="search-auto-complete"
                disableClearable
                sx={{ 
                    width: 300,
                    // color: 'var(--text-color)',
                    //backgroundColor: 'var(--graph-bg)', // Changes the background of the input field
                    '& .MuiOutlinedInput-notchedOutline': { // Targets the border of the outlined variant
                    borderColor: 'var(--text-color)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { // Targets the border on hover
                    borderColor: 'var(--text-color)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Targets the border when focused
                    borderColor: 'var(--text-color)',
                    },
                    '& .MuiInputBase-input': { // Targets the actual input text
                    color: 'var(--text-color)',
                    },
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: 'var(--text-color)', // Hover border color
                        },
                    }
                }}
                options={allCountyNames}
                getOptionLabel={(option) => option.county_name}
                getOptionKey={(option) => option.fips_id}
                filterOptions={filterOptions}
                renderInput={(params) => 
                    <TextField {...params} 
                        label="County Name" 
                    />}

                value={county}
                onChange={(e, newCounty) => setCounty(newCounty)}

                inputValue={inputValue}
                onInputChange={(e, newInputValue) => setInputValue(newInputValue)}

            />
            <button type="submit" className="search-button"><SearchIcon/></button>
            
        </form>
       
        {loading && 
        <div>
            <p className='loading-txt'>Loading... One moment please!</p>
        </div>
        }
        {errorMessage()}
        
    </div>
  )
}

export default SearchBar