import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context
}

export const AuthProvider = ({ children }) =>{
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(()=> {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        setToken(savedToken)
        const userData = JSON.parse(savedUser)
        setUser(userData)
    },[])



    //======================functions========================

    const login = async (ElementInternals, password) =>{
        const response = await fetch('https://real-estate-helper-api.onrender.com/users/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (response.status == 200){

            const loginData = await response.json()

            setToken(loginData.token)
            setUser(login.user)
            localStorage.setItem('token', loginData.token)
            localStorage.setItem('user', JSON.stringify(loginData.user))

            return true
        } else {
            return false
        }
    }

    const updateUser = async (updateData) =>{
        const response = await fetch('https://real-estate-helper-api.onrender.com/users',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer' + token
            },
            body: JSON.stringify(updateData)
        })

        if (response.status == 200){
            const updatedUserData = await response.json()

            setUser(updatedUserData)
            localStorage.setItem('user', JSON.stringify(updatedUserData))

            return true
        } else {
            return false
        }
    }


    const registerUser = async (registerData) =>{
        const response = await fetch('https://real-estate-helper-api.onrender.com/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })

        if (response.status == 200){
            const responseData = await response.json()
            console.log(responseData)

            return true
        } else {
            return false
        }
    }

     const logout = () => {
        setToken('')
        setUser('')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }


    const deleteUser = async () => {
        const response = await fetch('https://real-estate-helper-api.onrender.com/users',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const responseData = await response.json();
        console.log(responseData);
        logout();
    }
    


    const value = {
        token,
        user,
        updateUser,
        registerUser,
        deleteUser,
        login,
        logout,
        isAuthenticated: token ? true : false
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )

}