import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'
import { useLocationData } from '../contexts/LocationDataContext'
import { useTheme } from '../contexts/ThemeContext'

import { LineChart} from '@mui/x-charts/LineChart'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder'
import { Drawer } from '@mui/material'
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
    { value: 'active_listing_count_yy', label: 'Active Listing Count - Y/Y % Change' },
    { value: 'median_days_on_market', label: 'Median Days on Market' }, 
    { value: 'median_listing_price', label: 'Median Listing Price' },
    { value: 'price_reduced_count', label: 'Price Reduced Count' },
    { value: 'pending_listing_count', label: 'Pending Listing Count' },
  ]

  const [selectedValue, setSelectedValue] = useState(availableMetrics[0].value);

  // const GradientComponent = () => {
  //   const {
  //     top,
  //     bottom,
  //     height
  //   } = useDrawingArea();
  //   const svgHeight = top + bottom + height;

  //   return ( 
  //     <defs>
  //     <linearGradient 
  //     id = "myGradient"
  //     x1 = "0"
  //     y1 = "0"
  //     x2 = "0"
  //     y2 = {`${svgHeight}px`}
  //     gradientUnits = "userSpaceOnUse" >
  //     <
  //     stop offset = "0%"
  //     stopColor = "#B519EC"
  //     stopOpacity = "0.4" / >
  //     <
  //     stop offset = "100%"
  //     stopColor = "#B519EC"
  //     stopOpacity = "0" / >
  //     </linearGradient> 
  //     </defs>
  //   );
  // };


  return (
    <div>
      {tempCountyNameMap &&
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', top: '10vh' },
          }}
          >
          <div className='countyDataSettings'>
            <FormControl>
              <FormLabel 
              id="demo-radio-buttons-group-label"
              sx={{ 
                color: darkMode ? '#ffffff' : '#000000', 
                "&.Mui-focused": {
                  color: darkMode ? '#ffffff' : '#000000', 
                },
                }}>
                County Metric:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={selectedValue}
                onChange={handleChange}
              >
                {availableMetrics.map((metric) => (
                  <FormControlLabel 
                  key={metric.value} 
                  value={metric.value} 
                  // control={<Radio />} 
                  label={metric.label}
                  control={
                    <Radio
                      sx={{
                        color: 'var(--text-color)', // Unchecked color
                        '&.Mui-checked': {
                          color: 'orange', // Checked color
                        },
                      }}
                    />
                  } />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </Drawer>
      }
      <SearchBar/>
      {tempCountyNameMap &&
        <div>

          <div className='countyDataContainer'>
            {/* <div className='countyDataSettings'>
            <FormControl>
              <FormLabel 
              id="demo-radio-buttons-group-label"
              sx={{ 
                color: darkMode ? '#ffffff' : '#000000', 
                "&.Mui-focused": {
                  color: darkMode ? '#ffffff' : '#000000', 
                },
                }}>
                County Metric:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={selectedValue}
                onChange={handleChange}
              >
                {availableMetrics.map((metric) => (
                  <FormControlLabel 
                  key={metric.value} 
                  value={metric.value} 
                  // control={<Radio />} 
                  label={metric.label}
                  control={
                    <Radio
                      sx={{
                        color: 'var(--text-color)', // Unchecked color
                        '&.Mui-checked': {
                          color: 'orange', // Checked color
                        },
                      }}
                    />
                  } />
                ))}
              </RadioGroup>
            </FormControl>
            </div> */}

            <div className='homeCountyDataGraph'>

              <div className='soloCountyHeader'>
                <h2> {tempCountyNameMap.county_name} </h2>
                {/* <p> (FIPS: {tempCountyNameMap.fips_id}) </p> */}
                <IconButton onClick={handleToggleFavorite} className='favoriteBtn'>
                  {checkFavorited(tempCountyNameMap.fips_id) ? <FavoriteIcon style={{color: darkMode ? '#ff3779ff' : '#ff004cff'}}/> : <FavoriteBorderIcon style={{color: darkMode ? '#ffffff' : '#000000'}}/>}
                </IconButton>
              </div>

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
                        color: darkMode ? '#00e1ff' : 'blue',
                        showMark: false,
                      },
                    ]}
                    
                    sx={{

                    // Change color of the x-axis line
                    '& .MuiChartsAxis-root .MuiChartsAxis-line': {
                      stroke: darkMode ? '#bbbbbbff' : '#000000',
                    },
                    // Change color of x-axis ticks
                    '& .MuiChartsAxis-root .MuiChartsAxis-tick': {
                      stroke: darkMode ? '#bbbbbbff' : '#000000',
                    },
                    // Change color of x-axis tick labels
                    '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
                      fill: darkMode ? '#e3e3e3ff' : '#000000',
                    },
                    // "& .MuiChartsArea-root": {
                    //   fill: "url(#myGradient)",
                    // },
                    
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