import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithRedirect,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from './config'

// User tiers
export enum UserTier {
  FREE = 'free',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

// User data structure
export interface UserData {
  uid: string
  email: string
  displayName?: string
  tier: UserTier
  promptsUsed: number
  promptLimit: number
  createdAt: any
  lastLoginAt: any
}

// Default prompt limits by tier
const PROMPT_LIMITS = {
  [UserTier.FREE]: 5,
  [UserTier.PREMIUM]: 100,
  [UserTier.ADMIN]: Infinity,
}

// Create a new user with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Create user document in Firestore
    await createUserDocument(user, { displayName })

    return user
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

// Sign in with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    await updateLoginTimestamp(userCredential.user.uid)
    return userCredential.user
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()

    // Configure custom parameters
    provider.setCustomParameters({
      prompt: 'select_account',
    })

    // Add additional OAuth scopes
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    // Use redirect-based sign in for Chrome extensions
    await signInWithRedirect(auth, provider)

    // The sign-in process will redirect and then return to the extension
    // We'll handle the redirect result in the AuthProvider component
  } catch (error: any) {
    console.error('Error initiating Google sign-in:', error)
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error(
        'This domain is not authorized for Google sign-in. Please contact support.'
      )
    }
    throw error
  }
}

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

// Create user document in Firestore
export const createUserDocument = async (
  user: User,
  additionalData: any = {}
) => {
  if (!user) return

  const userRef = doc(db, 'users', user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user

    const userData: UserData = {
      uid: user.uid,
      email: email || '',
      displayName: displayName || additionalData.displayName || '',
      tier: UserTier.FREE,
      promptsUsed: 0,
      promptLimit: PROMPT_LIMITS[UserTier.FREE],
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    }

    try {
      await setDoc(userRef, userData)
    } catch (error) {
      console.error('Error creating user document:', error)
    }
  }

  return userRef
}

// Update user's last login timestamp
export const updateLoginTimestamp = async (uid: string) => {
  const userRef = doc(db, 'users', uid)
  try {
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating login timestamp:', error)
  }
}

// Get current user data
export const getCurrentUserData = async (): Promise<UserData | null> => {
  const user = auth.currentUser

  if (!user) return null

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }

    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// Track prompt usage
export const trackPromptUsage = async (
  uid: string
): Promise<{ canUse: boolean; remainingPrompts: number }> => {
  const userRef = doc(db, 'users', uid)

  try {
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData
      const promptsUsed = userData.promptsUsed + 1

      // Check if user can use more prompts
      const canUse = promptsUsed <= userData.promptLimit
      const remainingPrompts = Math.max(0, userData.promptLimit - promptsUsed)

      // Only update if they can use
      if (canUse) {
        await updateDoc(userRef, { promptsUsed })
      }

      return { canUse, remainingPrompts }
    }

    return { canUse: false, remainingPrompts: 0 }
  } catch (error) {
    console.error('Error tracking prompt usage:', error)
    return { canUse: false, remainingPrompts: 0 }
  }
}

// Upgrade user to premium
export const upgradeUserToPremium = async (uid: string) => {
  const userRef = doc(db, 'users', uid)

  try {
    await updateDoc(userRef, {
      tier: UserTier.PREMIUM,
      promptLimit: PROMPT_LIMITS[UserTier.PREMIUM],
    })
  } catch (error) {
    console.error('Error upgrading user:', error)
    throw error
  }
}

// Set user as admin (should be done via Firebase Admin SDK in a secure environment)
export const setUserAsAdmin = async (uid: string) => {
  const userRef = doc(db, 'users', uid)

  try {
    await updateDoc(userRef, {
      tier: UserTier.ADMIN,
      promptLimit: PROMPT_LIMITS[UserTier.ADMIN],
    })
  } catch (error) {
    console.error('Error setting user as admin:', error)
    throw error
  }
}
