import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSwitch from '../ThemeSwitch';
import CottageIcon from '@mui/icons-material/Cottage';
import './NavBar.css'

const NavBar = () => {

    const navigate = useNavigate();
    const { logout, user, isAuthenticated } = useAuth();
    const { darkMode, toggleTheme } = useTheme(); 

    const handleLogout = () => {
      logout();
      navigate('/login')
    }

    // const getLocationNames = 

  return (
    <header className={darkMode ? 'mainDark' : 'mainLight'}>
        <nav>
          <div className='nav-leftside'>
            <h1 id='title'><CottageIcon></CottageIcon> Curb Appeal</h1>  
            <div className='welcome'>
                {isAuthenticated &&
                <h2 className='welcomeName'>Welcome {user.first_name} {user.last_name}!</h2>
                }
            </div>
          </div>
          <div className='nav-rightside'>
            <ul className='navLinks'>
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
                
            </ul>
            <ThemeSwitch onClick={toggleTheme}/>
            </div>
        </nav>
    </header>
  )
}

export default NavBar