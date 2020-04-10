import React, { useContext, useState } from 'react'

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => { }
})


const AuthContextProvider = (props) => {
    const [authenticated, setAuthenticate] = useState(false)
    const login = () => {
        setAuthenticate(true)
    }

    return (
        <AuthContext.Provider value={{
            login: login,
            isAuth: authenticated
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider