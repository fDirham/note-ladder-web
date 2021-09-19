import AuthController from "controllers/AuthController"
import UserController from "controllers/UserController"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { useRouter } from "next/dist/client/router"
import React, { useEffect, useState } from "react"
import { user } from "types/users"
import styles from "styles/User.module.scss"
import { ladder } from "types/rungs"
import LaddersList from "components/LaddersList"

export default function UserPage() {
  const router = useRouter()
  const authState: authStateType = useAuthState()
  const { user: currentDisplayName } = router.query
  const dummyLadders: ladder[] = [
    { name: "ladder1", order: 0, id: "test0", author: authState.uid },
    { name: "sometext", order: 1, id: "test1", author: authState.uid },
    { name: "lol wtf HUH", order: 2, id: "test2", author: authState.uid },
    { name: "HAHAHAHAH", order: 3, id: "test3", author: authState.uid },
  ]
  const dummyUser: user = {
    displayName: currentDisplayName as string,
    uid: "",
    email: "",
    ladders: dummyLadders,
  }
  const [currentUser, setCurrentUser] = useState<user>()
  const [editingLadderId, setEditingLadderId] = useState<string>() // Ladder id being edited
  const [networkError, setNetworkError] = useState<boolean>(false)

  useEffect(() => {
    getCurrentUser()
  }, [currentDisplayName])

  async function getCurrentUser() {
    if (!currentDisplayName || currentUser) return
    const retrievedUser = await UserController.getUser(
      currentDisplayName as string
    )
    if (!retrievedUser) return handleNotFound()
    setCurrentUser(retrievedUser)
  }

  function handleNotFound() {
    if (authState.uid) {
      return setNetworkError(true)
    }
    window.alert("User not found")
    router.push("/")
  }

  async function logOut() {
    const accessToken = await authState.getAccessToken()
    const logOutSuccess = await AuthController.logOut(accessToken)
    if (!logOutSuccess)
      return window.alert("Error logging out, try again later")
    authState.resetState()
    router.push("/")
  }

  function addNewLadder(order: number) {
    const newLadders = [...currentUser.ladders]
    const newLadder: ladder = {
      order,
      name: "",
      id: "new-ladder-" + Math.random(),
      new: true,
      author: authState.uid,
    }
    newLadders.splice(order, 0, newLadder)
    updateUserLadders(newLadders)
    setEditingLadderId(newLadder.id)
  }

  function isUser() {
    if (!currentUser || !authState.uid) return false
    return currentUser.uid === authState.uid
  }

  function updateUserLadders(newLadders: ladder[]) {
    const newUser = { ...currentUser }
    newUser.ladders = newLadders
    setCurrentUser(newUser)
  }

  if (networkError) return <div>Network error LOL</div>
  if (!currentUser) return <div>Loading...</div>
  return (
    <div className={styles.container}>
      <h1>{currentDisplayName}</h1>
      {isUser() && <button onClick={logOut}>Logout</button>}
      {isUser() && !currentUser.ladders.length && (
        <button onClick={() => addNewLadder(0)}>New ladder</button>
      )}
      <LaddersList
        ladders={currentUser.ladders || []}
        updateLadders={updateUserLadders}
        addNewLadder={addNewLadder}
        editingLadderId={editingLadderId}
        setEditingLadderId={setEditingLadderId}
      />
    </div>
  )
}
