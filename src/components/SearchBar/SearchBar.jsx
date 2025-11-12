import React, { useState } from 'react'
import { useLocationData } from '../../contexts/LocationDataContext'
import './SearchBar.css'
import { Autocomplete, createFilterOptions, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { formatCountyName } from '../../utils/formatters';

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

            <Autocomplete
                className="input-autocomplete"
                id="search-auto-complete"
                disableClearable
                sx={{ 
                    width: 300,
                    backgroundColor: 'var(--graph-bg)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--graph-bg)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-color)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--text-color)' },
                    '& .MuiInputBase-input': { color: 'var(--text-color)' },
                    // '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {backgroundColor: 'green'},
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: 'var(--text-color)' },
                    }
                }}

                options={allCountyNames}
                getOptionLabel={(option) => formatCountyName(option.county_name)}
                getOptionKey={(option) => option.fips_id}
                filterOptions={filterOptions}
                renderInput={(params) => 
                    <TextField {...params} label="County Name" />
                }
                value={county}
                onChange={(e, newCounty) => {
                    setCounty(newCounty);
                    if (newCounty && newCounty.county_name) {
                        setInputValue(formatCountyName(newCounty.county_name));
                    }
                }}
                inputValue={inputValue}
                onInputChange={(e, newInputValue, reason) => {
                    // Only update inputValue directly if user is typing
                    if (reason === 'input') {
                        setInputValue(newInputValue);
                    }
                }}
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