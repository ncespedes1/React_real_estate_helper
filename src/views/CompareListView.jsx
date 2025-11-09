import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocationData } from '../contexts/LocationDataContext'

import { LineChart } from '@mui/x-charts/LineChart'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder'

const CompareListView = () => {

  const { user, isAuthenticated } = useAuth();
  const {tempCountyNameMap, tempCountyData, getFormattedData, compareCountyList, assignCompareCounty, removeCompareCounty, checkFavorited, favoritesData } = useLocationData();
 
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

  // const xAxisData = (favoritesData && favoritesData.size > 0) ?
    // getFormattedData(favoritesData[0]).map(item => (
    //   item.info_date
    // )) : [];
  

  
  return (
    <div>
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

          {Array.from(favoritesData.entries()).map(([fips_id, data]) => (
            <LineChart key={fips_id}
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
                  color: 'blue',
                  showMark: false,
                },
              ]}
              height={300}
              width={800}
            />
            ))}
        </div>
      </div>
    </div>
  )
}

export default CompareListView