import React, { useState } from 'react'
import { useLocationData } from '../../contexts/LocationDataContext'
import './SearchBar.css'
import { Autocomplete, CircularProgress, createFilterOptions, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { formatCountyName } from '../../utils/formatters';

const SearchBar = () => {

    const [county, setCounty] = useState(null)
    const [inputValue, setInputValue] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { allCountyNames, getCountyData } = useLocationData()


    const handleSubmit = async (event, selectedCounty = county) => {
        setError(false)
        setLoading(true)
        event.preventDefault()

        //===============

        let countyToUse = selectedCounty

        // If no county selected, try to match input to first option
        if (!countyToUse && inputValue) {
            countyToUse = allCountyNames.find(
                (c) => c.county_name.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            setCounty(countyToUse || null)
        }

        if (!countyToUse) {
            setError(true)
            setLoading(false)
            return
        }
        console.log(countyToUse)

        //===============


        const countyDataFound = await getCountyData(countyToUse.fips_id, countyToUse.county_name)
    
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
                freeSolo
                autoHighlight
                options={allCountyNames}
                getOptionLabel={(option) => formatCountyName(option.county_name)}
                getOptionKey={(option) => option.fips_id}
                filterOptions={filterOptions}
                renderInput={(params) => 
                    <TextField {...params} label="County Name" />
                }
                value={county}
                onChange={(e, newCounty) => {
                    if (newCounty && newCounty.county_name) {
                        setCounty(newCounty);
                        setInputValue(formatCountyName(newCounty.county_name));
                        handleSubmit(e, newCounty)
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
            <button type="submit" className="search-button" disabled={loading}>
                {loading ? <CircularProgress size={20}/> : <SearchIcon/>}
                
            </button>
            
        </form>
       
        {errorMessage()}
        
    </div>
  )
}

export default SearchBar