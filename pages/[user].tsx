import AuthController from "controllers/AuthController"
import UserController from "controllers/UserController"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { useRouter } from "next/dist/client/router"
import React, { useEffect, useRef, useState } from "react"
import { user } from "types/users"
import styles from "styles/User.module.scss"
import { ladder } from "types/rungs"
import LaddersList from "components/LaddersList"
import { cacheStateType, useCacheState } from "globalStates/useCacheStore"
import { cursorStateType, useCursorState } from "globalStates/useCursorStore"
import PageWrapper from "components/PageWrapper"
import LoadingOverlay from "components/LoadingOverlay"

export default function UserPage() {
  const router = useRouter()
  const { user: currentDisplayName } = router.query
  const authState: authStateType = useAuthState()
  const cacheState: cacheStateType = useCacheState()
  const cursorState: cursorStateType = useCursorState()

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
  const [loading, setLoading] = useState<boolean>(true)
  const _notMounted = useRef(false)

  useEffect(() => {
    return () => {
      _notMounted.current = true
    }
  }, [])

  useEffect(() => {
    getCurrentUser()
  }, [currentDisplayName])

  async function getCurrentUser() {
    if (!currentDisplayName || currentUser) return

    const { currentUser: cachedUser } = cacheState
    if (cachedUser && cachedUser.displayName === currentDisplayName)
      setCurrentUser(cachedUser)
    else {
      cursorState.setState({ ladderCursor: 0 })
    }

    const retrievedUser = await UserController.getUser(
      currentDisplayName as string
    )

    if (_notMounted.current) return

    if (!retrievedUser) return handleNotFound()
    cacheState.setState({ currentUser: retrievedUser })
    setCurrentUser(retrievedUser)
    setLoading(false)
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

  return (
    <PageWrapper loading={loading}>
      <h1>{currentDisplayName}</h1>
      {currentUser && (
        <>
          <div className={styles.containerSpace}>
            {isUser() && (
              <>
                <button onClick={logOut}>Logout</button>
              </>
            )}
          </div>
          <LaddersList
            ladders={currentUser.ladders || []}
            updateLadders={updateUserLadders}
            addNewLadder={addNewLadder}
            editingLadderId={editingLadderId}
            setEditingLadderId={setEditingLadderId}
            loading={loading}
          />
        </>
      )}
    </PageWrapper>
  )
}
