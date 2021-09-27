import { firebaseAuth } from "firebaseApp"
import { authStateType } from "globalStates/useAuthStore"
import { SetState } from "zustand"

export async function getAccessToken(resetState: () => void) {
  if (!firebaseAuth.currentUser) {
    resetState()
    window.location.href = window.location.origin
    window.alert("Session might have expired. Please log in.")
    return ""
  }
  const newToken = await firebaseAuth.currentUser.getIdToken(true)
  return newToken
}
