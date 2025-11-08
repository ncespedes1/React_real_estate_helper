import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar/SearchBar'
import { useLocationData } from '../contexts/LocationDataContext'
import { LineChart } from '@mui/x-charts/LineChart'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import './HomeView.css'

const HomeView = () => {

  const { user, isAuthenticated } = useAuth();
  const {tempCountyNameMap, tempCountyData, getFormattedData} = useLocationData();


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
          <h2>{tempCountyNameMap.county_name} (FIPS: {tempCountyNameMap.fips_id})</h2>
          {isAuthenticated ? 'clickable heart' : 'blank heart'}

          <div className='countyDataContainer'>
            
            <FormControl className='countyDataSettings'>
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

            <div className='countyDataGraphs'>
              <LineChart
              dataset={getFormattedData(tempCountyData)}
                xAxis={[{ dataKey: 'info_date', scaleType: 'time' }]}
                series={[
                  {
                    dataKey: selectedValue,
                    label: availableMetrics.find(option => option.value === selectedValue)?.label,
                    color: 'blue',
                    showMark: false,
                  },
                ]}
                height={300}
                width={800}
              />
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default HomeView