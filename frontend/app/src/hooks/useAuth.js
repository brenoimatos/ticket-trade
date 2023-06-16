import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import api from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children, storedUserData }) => {
  const [user, setUser] = useLocalStorage('user', storedUserData)
  const login = async () => {
    const myUser = await api.getMyUser() // Aguarda a Promise ser resolvida
    console.log('myUser', myUser)
    setUser(myUser.id)
    console.log('AuthProviderUser', user)
    console.log('Logged on')
  }

  const logout = useCallback(() => {
    setUser(null)
    return console.log('Logged out')
  }, [setUser]) // Adicione quaisquer dependências que a função logout possa ter

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
