import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationDataContext = createContext();

export const useLocationData = () => {
    const context = useContext(LocationDataContext);

    return context;
}

export const LocationDataProvider = ({ children }) => {

    const [allCountyNames, setAllCountyNames] = useState([]) //fips and county name only
    const [tempCountyNameMap, setTempCountyNameMap] = useState(null) //mapping of fips to county name
    const [tempCountyData, setTempCountyData] = useState(null) //full county data for selected county   
    const [compareCountyList, setCompareCountyList] = useState([]) //list of counties (max 3) to compare

    useEffect(() => {
        getCountyNames()
    },[])

    //======================functions========================
    
    // getting all county names and fips at start
    const getCountyNames = async() => {
        const response = await fetch('https://real-estate-helper-api.onrender.com/county_name_mapping',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status == 200){
            const countyNamesData = await response.json()
            console.log(countyNamesData)
            setAllCountyNames(countyNamesData)
        } else {
            console.log('Error getting initial county names')
        }
    }

    //Getting specific county historical data by fips id
    const getCountyData = async(fips_id, county_name) => {
        const response = await fetch(`https://real-estate-helper-api.onrender.com/county_data/${fips_id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status == 200){
            const countyData = await response.json()
            console.log(countyData)
            setTempCountyNameMap({
                fips_id: fips_id,
                county_name: county_name})
            return countyData
        } else {
            console.log('Error getting county data')
        }
    }

    const value = {
        allCountyNames,
        tempCountyNameMap,
        getCountyNames,
        getCountyData,
        
    }

    return (
        <LocationDataContext.Provider value={value}>
            { children}
        </LocationDataContext.Provider>
    )
}
