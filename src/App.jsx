import { useState } from 'react'
import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Routes, Route  } from "react-router-dom";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";
import UpdateProfileView from "./views/UpdateProfileView";
import RegisterUserView from './views/RegisterUserView';
import CompareListView from './views/CompareListView';
import { useTheme } from "./contexts/ThemeContext"
import './App.css'

function App() {
  const { darkMode } = useTheme();

  return (
    <div id='appDiv'className={darkMode ? 'mainDark' : 'mainLight'}>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<HomeView/>}/>
          <Route path='/login' element={<LoginView/>}/>
          <Route path='/profile' element={<ProfileView/>}/>
          <Route path='/favorites' element={<CompareListView/>}/>
          <Route path='/profile/update' element={<UpdateProfileView/>}/>
          <Route path='/register' element={<RegisterUserView/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
