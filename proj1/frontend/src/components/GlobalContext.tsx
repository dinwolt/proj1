import React, { createContext, useState, useContext } from "react"

type GlobalContextType = {
  refreshKey: number
  triggerRefresh: () => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1) 
  }

  return (
    <GlobalContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }
  return context
}
