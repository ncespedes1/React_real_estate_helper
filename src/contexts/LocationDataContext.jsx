import React, { createContext, useContext, useState, useEffect } from 'react';
import { data } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LocationDataContext = createContext();

export const useLocationData = () => {
    const context = useContext(LocationDataContext);

    return context;
}

export const LocationDataProvider = ({ children }) => {
    
    const { token } = useAuth();
    const [allCountyNames, setAllCountyNames] = useState([]) //fips and county name only
    const [tempCountyNameMap, setTempCountyNameMap] = useState(null) //mapping of fips to county name
    const [tempCountyData, setTempCountyData] = useState(null) //full county data for selected county   
    const [compareCountyList, setCompareCountyList] = useState([]) //list of counties (max 3) to compare
    const [favoritesData, setFavoritesData] = useState(new Map()) //full data of favorited counties

    useEffect(() => {
        getCountyNames()
        if (token){
            getFavorites()
        }
    },[token])

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

    //Getting authenticated user's favorite counties list
    const getFavorites = async() => {
        const response = await fetch('https://real-estate-helper-api.onrender.com/users/view_compare_counties',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token

            }
        })

        if (response.status == 200){
            const compareCountiesData = await response.json()
            console.log(compareCountiesData)
            setCompareCountyList(compareCountiesData)
            getFavoritesData(compareCountiesData)
        }
    }

    //Helper function to fetch county data by fips id (getCountyData and getFavoriteCountyData)
    const fetchCountyData = async(fips_id) => {
        const response = await fetch(`https://real-estate-helper-api.onrender.com/county_data/${fips_id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response
    }

    //Getting specific county historical data by fips id 
    // **this also changes the temp county name map for HomeView**
    const getCountyData = async(fips_id, county_name) => {
        const response = await fetchCountyData(fips_id)

        if (response.status == 200){
            const countyData = await response.json()
            console.log(countyData)
            setTempCountyNameMap({
                fips_id: fips_id,
                county_name: county_name})
            setTempCountyData(countyData)
            return countyData
        } else {
            console.log('Error getting county data')
        }
    }

        //Getting specific county historical data by fips id 
        // **this is only used for Favorites to avoid changing HomeView**
    const getFavoriteCountyData = async(fips_id, county_name) => {
        const response = await fetchCountyData(fips_id)

        if (response.status == 200){
            const countyData = await response.json()
            console.log(countyData)
            return countyData
        } else {
            console.log('Error getting county data')
        }
    }


    const assignCompareCounty = async(fips_id, county_name) => {
        if (compareCountyList.length >=3 ){
            console.log('Cannot add more than 3 counties to compare list')
            return false;
        }

        const response = await fetch(`https://real-estate-helper-api.onrender.com/users/assign_compare_county/${fips_id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        if (response.status == 200){
            console.log(`Successfully assigned ${county_name} to compare list`)
            setCompareCountyList((prev) => [...prev, {fips_id, county_name}])
            setFavoritesData((prev) => {
                const newMap = new Map(prev)
                newMap.set(fips_id, tempCountyData)
                return newMap
            })
            return true;
        } else {
            console.log('Error assigning compare county')
            return false;
        }
    }

    const removeCompareCounty = async(fips_id, county_name) => {
        const response = await fetch(`https://real-estate-helper-api.onrender.com/users/remove_compare_county/${fips_id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        if (response.status == 200){
            console.log(`Successfully removed ${county_name} from compare list`)
            setCompareCountyList((prev) => prev.filter(county => county.fips_id !== fips_id))
            setFavoritesData((prev) => {
                const newMap = new Map(prev)
                newMap.delete(fips_id)
                return newMap
            })
            return true;
        } else {
            console.log('Error removing compare county')
            return false;
        }
    }

    const getFavoritesData = async(list) => {
        const promises = []
        for (let county of list){
            promises.push(getFavoriteCountyData(county.fips_id, county.county_name))
        }
        const results = await Promise.all(promises)
        console.log(results.length)
        for (const countyResult of results){
            
            setFavoritesData((prev) => {
                const newMap = new Map(prev)
                newMap.set(countyResult[0].fips_id, countyResult)
                return newMap
            })
        }
    }


    const checkFavorited = (fips_id) => {
        return compareCountyList.some(county => county.fips_id === fips_id);
    }

    const getFormattedData = (data) => {
        return data.map(item => ({
            ...item,
            info_date: new Date(item.info_date)
        })).reverse();
    }


    const value = {
        // ----------------------states------------------------
        allCountyNames,
        tempCountyNameMap,
        tempCountyData,
        compareCountyList,
        favoritesData,
        // ----------------------functions------------------------
        // getCountyNames,
        // getFavorites,
        getCountyData,
        assignCompareCounty,
        removeCompareCounty,
        getFormattedData,
        checkFavorited
        
    }

    return (
        <LocationDataContext.Provider value={value}>
            { children}
        </LocationDataContext.Provider>
    )
}
