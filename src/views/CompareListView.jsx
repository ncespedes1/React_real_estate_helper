import React, { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocationData } from '../contexts/LocationDataContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeSwitch from '../components/ThemeSwitch'

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
import { Drawer } from '@mui/material'

const CompareListView = () => {

  const { user, isAuthenticated } = useAuth();
  const {tempCountyNameMap, tempCountyData, getFormattedData, compareCountyList, assignCompareCounty, removeCompareCounty, checkFavorited, favoritesData } = useLocationData();
  const { darkMode, toggleTheme } = useTheme();
 
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const removeFavorite = (fips_id) => {
    removeCompareCounty(fips_id, compareCountyList.find(county => county.fips_id === fips_id).county_name);
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

  // ==============MULTILINE GRAPH AREA=================

  const mergedDataset = useMemo(() => {
    const result = [];
  
    Array.from(favoritesData.entries()).forEach(([fips_id, data]) => {
      const county = compareCountyList.find(c => c.fips_id === fips_id);
    
      getFormattedData(data).forEach(item => {
        let mergedItem = result.find(d => d.info_date.getTime() === item.info_date.getTime());
        if (!mergedItem) {
          mergedItem = { info_date: item.info_date };
          result.push(mergedItem);
        }
        mergedItem[fips_id] = item[selectedValue];
      });
    });
    result.forEach(row => {
      Array.from(favoritesData.keys()).forEach(fips_id => {
        if (typeof row[fips_id] !== 'number') {
          row[fips_id] = null;
        }
      });
    });
    return result;
  }, [favoritesData, compareCountyList, getFormattedData, selectedValue]);


  const series = useMemo(() => (
    Array.from(favoritesData.keys()).map(fips_id => ({
      dataKey: fips_id,
      label: compareCountyList.find(c => c.fips_id === fips_id)?.county_name || fips_id,
      showMark: false,
      // area: true,
    }))
  ), [favoritesData, compareCountyList]);


  // ==========================================
  

  
  return (
    <div>
      <div className='countyDataContainer'>

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
        <div className='countyDataGraphs'>
          <div className='mergedChart'>
            <LineChart 
              dataset={mergedDataset}
              xAxis={[{
                dataKey: 'info_date',
                scaleType: 'time',
                valueFormatter: (date) => date.toLocaleDateString(),
              }]}
              series={series}
              colors={darkMode ? [ '#00e1ff', '#ff7300', '#ff00f6'] : ['blue', '#ff7300', '#ff00f6']}

              // sx={() => ({

              //   [`& .${axisClasses.tickLabel}`]: {
              //     fill: darkMode ? '#ffffff' : '#000000',
              //   },
              //   [`& .${axisClasses.tick}, & .${axisClasses.line}`]: {
              //     stroke: darkMode ? '#bbbbbbff' : '#000000', 
              //   }
                
              // })}
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
              tooltip={{ trigger: 'axis' }}
            />
          </div>
          

          {Array.from(favoritesData.entries()).map(([fips_id, data]) => (
            <div key={fips_id} className='individualCountyChart'>

              <LineChart 
              dataset={getFormattedData(data)}
                xAxis={[{ 
                  dataKey: 'info_date',
                  scaleType: 'time',
                  valueFormatter: (date) => date.toLocaleDateString(),

                    }]}
                series={[
                  {
                    dataKey: selectedValue,
                    label: compareCountyList.find(county => county.fips_id === fips_id).county_name,
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
              
              <IconButton onClick={() => removeFavorite(fips_id)} className='favoriteBtn' >
                <FavoriteIcon style={{color: darkMode ? '#ff3779ff' : '#ff004cff'}}/>
              </IconButton>
              
            </div>
            ))}
          
        </div>
        <div>
          <p>Up to 3 counties can be Favorited at a time</p>
        </div>
      </div>
    </div>
  )
}

export default CompareListView