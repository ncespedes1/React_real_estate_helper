import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'
import { useLocationData } from '../contexts/LocationDataContext'
import { useTheme } from '../contexts/ThemeContext'

import { LineChart } from '@mui/x-charts/LineChart'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder'
import { axisClasses } from '@mui/x-charts'

import './HomeView.css'


const HomeView = () => {

  const { user, isAuthenticated } = useAuth();
  const {tempCountyNameMap, tempCountyData, getFormattedData, compareCountyList, assignCompareCounty, removeCompareCounty, checkFavorited} = useLocationData();
  const { darkMode, toggleTheme } = useTheme();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert('Please log in to manage favorites.');
      return;
    }
    if (!checkFavorited(tempCountyNameMap.fips_id)) {
      if (compareCountyList.length >= 3) {
        alert('You can only compare up to 3 counties.');
        return;
      }
      assignCompareCounty(tempCountyNameMap.fips_id, tempCountyNameMap.county_name);
    } else {
      removeCompareCounty(tempCountyNameMap.fips_id, tempCountyNameMap.county_name);
    }
  }

  const availableMetrics = [
    { value: 'active_listing_count', label: 'Active Listing Count' },
    { value: 'active_listing_count_yy', label: 'Active Listing Count Annual' },
    { value: 'median_days_on_market', label: 'Median Days on Market' }, 
    { value: 'median_listing_price', label: 'Median Listing Price' },
    { value: 'price_reduced_count', label: 'Price Reduced Count' },
    { value: 'pending_listing_count', label: 'Pending Listing Count' },
  ]

  const [selectedValue, setSelectedValue] = useState(availableMetrics[0].value);


  return (
    <div>
      <SearchBar/>
      {tempCountyNameMap &&
        <div>
          <div className='soloCountyHeader'>
            <h2>{tempCountyNameMap.county_name} (FIPS: {tempCountyNameMap.fips_id})</h2>
            
            <IconButton onClick={handleToggleFavorite} color='red' >
              {checkFavorited(tempCountyNameMap.fips_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>

          <div className='countyDataContainer'>
            <div className='countyDataSettings'>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">County Metric:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={selectedValue}
                onChange={handleChange}
              >
                {availableMetrics.map((metric) => (
                  <FormControlLabel key={metric.value} value={metric.value} control={<Radio />} label={metric.label} />
                ))}
              </RadioGroup>
            </FormControl>
            </div>

            <div className='countyDataGraphs'>
              <div className='individualCountyChart'>
                <LineChart
                dataset={getFormattedData(tempCountyData)}
                  xAxis={[{ 
                    dataKey: 'info_date',
                    scaleType: 'time',
                    valueFormatter: (date) => date.toLocaleDateString(),

                    }]}
                  series={[
                    {
                      dataKey: selectedValue,
                      label: availableMetrics.find(option => option.value === selectedValue)?.label,
                      color: 'blue',
                      showMark: false,
                    },
                  ]}
                  sx={{
                    [`& .${axisClasses.tickLabel}`]: {
                      fill: darkMode ? '#ffffff' : '#000000',
                    },
                    [`& .${axisClasses.tick}, & .${axisClasses.line}`]: {
                      stroke: darkMode ? '#bbbbbbff' : '#000000', 
                    }
                  }}

                  slotProps={{
                    legend: {
                      sx: {
                        color: darkMode ? '#ffffff' : '#000000',
                      },
                    },
                  }}

                  height={300}
                  width={800}
                />

                  {/* Add slider for date range */}
              </div>
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default HomeView