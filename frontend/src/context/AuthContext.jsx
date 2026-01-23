import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'
import { UserSlicePath } from '@/redux/slice/user.slice'

const AuthContext = createContext({
    fetchUserProfile: () => Promise.resolve(),
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = ({children}) => {
    const user = useSelector(UserSlicePath)

    const fetchUserProfile = async () => {
        // TODO:  API lấy thông tin user và dispatch vào Redux tại đây
        console.log("Đang lấy thông tin user...")
    }

    return (
    <AuthContext.Provider value={{ ...user, fetchUserProfile }}>
        {children}
    </AuthContext.Provider>
  )
}