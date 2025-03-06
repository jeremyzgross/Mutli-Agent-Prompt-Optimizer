import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { auth } from './config'
import {
  getCurrentUserData,
  UserData,
  createUserDocument,
  updateLoginTimestamp,
} from './auth'

interface AuthContextType {
  currentUser: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          // Check if user document exists, create if not
          const userDoc = await getCurrentUserData()
          if (!userDoc) {
            await createUserDocument(result.user)
          } else {
            await updateLoginTimestamp(result.user.uid)
          }
        }
      })
      .catch((error) => {
        console.error('Error handling redirect result:', error)
      })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        const userDataResult = await getCurrentUserData()
        setUserData(userDataResult)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
