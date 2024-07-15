'use client'

import React, { createContext, useContext, useState } from "react"

type IAdminProvider = {
    children: React.ReactNode
}

type IAdminContext = {
    mobile: {
        navbar: boolean,
        openNavbar: () =>  void
        closeNavbar: () =>  void
    }
}

const AdminContext = createContext<IAdminContext | null>(null);

export default function AdminContextProvider({
    children
}:IAdminProvider ){
    const [mobileNavbarOpen,setMobileNavbarOpen] = useState(false)

    const openMobileNavbar = () => {
        setMobileNavbarOpen(true)
    }

    const closeMobileNavbar = () => {
        setMobileNavbarOpen(false)
    }

    return (
        <AdminContext.Provider value={{
            mobile: {
                navbar: mobileNavbarOpen,
                openNavbar: openMobileNavbar,
                closeNavbar: closeMobileNavbar
            }
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdminContext = () => {
    const values = useContext(AdminContext)
    return values
}