import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'
import { useLocationData } from '../contexts/LocationDataContext'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

import { LineChart, areaElementClasses} from '@mui/x-charts/LineChart'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder'
import { Alert, Dialog, DialogContent, Drawer } from '@mui/material'
import { axisClasses } from '@mui/x-charts'
import { percentFormatter, priceFormatter } from '../utils/formatters'
import Popup from '../components/Popup/Popup'



const HomeView = () => {

  const { user, isAuthenticated } = useAuth();
  const {tempCountyNameMap, tempCountyData, getFormattedData, compareCountyList, assignCompareCounty, removeCompareCounty, checkFavorited} = useLocationData();
  const { darkMode, toggleTheme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('info');
  const [maxFavoritesPopupOpen, setMaxFavoritesPopupOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      handleShowPopup(
        (
          <div>
            Please <Link to="/login">log in</Link> or <Link to='/register'>register</Link> to manage favorites.
          </div>
        ),
        'info'
      )
      return;
    }
    if (!checkFavorited(tempCountyNameMap.fips_id)) {
      if (compareCountyList.length >= 3) {
        handleShowPopup(
          (
            <div>
              You can only compare up to 3 counties.
            </div>
          ),
          'warning'
        )
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

  const handleShowPopup = (message, severity) => {
    setPopupMessage(message);
    setPopupSeverity(severity);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupMessage('');
    setPopupSeverity('info');
  };

  function getValueFormatter() {
    if (selectedValue === 'active_listing_count_yy')
      return percentFormatter
    else if (selectedValue === 'median_listing_price')
      return priceFormatter
    return undefined
  }

  return (
    <div>
      {tempCountyNameMap &&
        <Drawer
          variant="permanent"
          sx={{
            width: 290,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { border: 'none', width: 290, boxSizing: 'border-box', top: '80px' },
          }}
          >
          <div className='countyDataSettings'>
            <FormControl>
              <FormLabel 
              id="demo-radio-buttons-group-label"
              sx={{ 
                color: darkMode ? '#ffffff' : '#000000', 
                fontSize: 20,
                padding: '10px 0', 
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

            <div className='homeCountyDataGraph'>

              <div className='soloCountyHeader'>
                <h2> {tempCountyNameMap.county_name} </h2>
                {/* <p> (FIPS: {tempCountyNameMap.fips_id}) </p> */}
                <IconButton onClick={handleToggleFavorite} className='favoriteBtn'>
                  {isAuthenticated && checkFavorited(tempCountyNameMap.fips_id) ? <FavoriteIcon style={{color: darkMode ? '#ff3779ff' : '#ff004cff'}}/> : <FavoriteBorderIcon style={{color: darkMode ? '#ffffff' : '#000000'}}/>}
                </IconButton>
                <Dialog
                open={isPopupOpen}
                onClose={handleClosePopup}
                aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Alert severity={popupSeverity}>
                      {popupMessage}
                    </Alert>
                  </DialogContent>
                </Dialog>
              </div>

              <div className='individualCountyChart'>
                <LineChart
                  dataset={getFormattedData(tempCountyData)}
                    xAxis={[{ 
                      dataKey: 'info_date',
                      scaleType: 'time',
                      valueFormatter: (date) => date.toLocaleDateString(),

                      }]}
                    yAxis={[
                      { valueFormatter: getValueFormatter() }
                    ]}
                    series={[
                      {
                        dataKey: selectedValue,
                        label: availableMetrics.find(option => option.value === selectedValue)?.label,
                        color: darkMode ? '#00e1ff' : '#3b48d7ff',
                        showMark: false,
                        valueFormatter: getValueFormatter(),
                        area: true,
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
                    [`& .${areaElementClasses.root}`]: {
                      fill: selectedValue === "active_listing_count_yy" ? "none" : "url(#areaGradient)",
                      filter: 'none'
                    },
                    
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
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor= {darkMode ? "#00bbffff" : "#468affff"} stopOpacity={1}/>
                      <stop offset="100%" stopColor="var(--primary-bg)" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                </LineChart>

                  {/* Add slider for date range */}
              </div>
              <p className='dataSource'> Data sourced from <a href="https://www.realtor.com/research/data/">Realtor.com</a>® Economic Research</p>

            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default HomeView