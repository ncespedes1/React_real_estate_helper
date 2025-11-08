import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './NavBar.css'

const NavBar = () => {

    const navigate = useNavigate();
    const { logout, user, isAuthenticated } = useAuth();
    const { darkMode, toggleTheme } = useTheme(); 

    const handleLogout = () => {
      logout();
      navigate('/')
    }

    // const getLocationNames = 

  return (
    <header className={darkMode ? 'mainDark' : 'mainLight'}>
        <nav>
            <h1 id='title'>Real Estate Helper</h1>  
            <div className='welcome'>
                {isAuthenticated &&
                <h2>Welcome {user.first_name} {user.last_name}!</h2>
                }
            </div>
            <ul>
                <NavLink to='/'>HOME</NavLink>
                {isAuthenticated ? 
                <>
                <NavLink to='/favorites'>FAVORITES</NavLink>
                <NavLink to='/profile'>PROFILE</NavLink>
                <NavLink to='/' onClick={handleLogout}>LOGOUT</NavLink>
                </>
                :
                <>
                <NavLink to='/login'>LOGIN</NavLink>
                <NavLink to='/register'>REGISTER</NavLink>
                
                </>
                }
                {/* <ThemeSwitch onClick={toggleTheme}/> */}
            </ul>
        </nav>
    </header>
  )
}

export default NavBar