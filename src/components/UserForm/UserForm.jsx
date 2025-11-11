import React from 'react'
import { useState } from 'react'
import './UserForm.css'
// import { CircularProgress } from '@mui/material'
import { useTheme } from '../../contexts/ThemeContext';

const UserForm = ({ submitFunction, onSuccessRedirect }) => {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const { darkMode } = useTheme(); 

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prevData => ({...prevData, [name]:value}))
    }

    const handleSubmit = async (e) => {
        setError(false)
        setLoading(true)
        e.preventDefault()


        const sentInfo = await submitFunction(formData)
        setLoading(false)
        if (sentInfo){
            setSuccess(true)
            onSuccessRedirect()
        } else {
            setError(true)
        }
    }

    const errorMessage = () => {
        return (
            <div  className='errorStatus' style={{display: error ? "" : "none"}}>
                <h4>Please try again.</h4>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div  className='successStatus' style={{display: success ? "" : "none"}}>
                <h4>Success!</h4>
            </div>
        )
    }



  return (
    <div className={darkMode ? 'container mainDark' : 'container mainLight'}>

      <form onSubmit={(e)=> {handleSubmit(e)}} className='userForm'>
        <h2>Please fill out the form below</h2>

        <div>
            <label htmlFor="first_name">First name: </label>
            <input name='first_name' placeholder='First name' onChange={(e)=>handleChange(e)} value={formData.first_name} required/>
        </div>

        <div>
            <label htmlFor="last_name">Last name:</label>
            <input name='last_name' placeholder='Last name' onChange={(e)=>handleChange(e)} value={formData.last_name} required/>
        </div>

        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name='email' placeholder='Email' onChange={(e)=>handleChange(e)} value={formData.email} required/>
        </div>

        <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name='password' placeholder='Password' onChange={(e)=>handleChange(e)} value={formData.password} required/>
        </div>

        {/* <div>
            <label htmlFor="role">Role:</label>
            <input type="role" name='role' placeholder='role' onChange={(e)=>handleChange(e)} value={formData.role} required/>
        </div> */}

        <button type='submit' style={{backgroundColor: darkMode ? 'rgb(107, 207, 260, 0.2)': '#336388ff'}}>Submit</button>

        {loading && 
            <div>
                
                <p>Loading. One moment please!</p>
            </div>
        }
        {errorMessage()}
        {successMessage()}

      </form>
    
    </div>
  )
}

export default UserForm