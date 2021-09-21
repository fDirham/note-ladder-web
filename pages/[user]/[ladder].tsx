import LadderController from "controllers/LadderController"
import UserController from "controllers/UserController"
import { useRouter } from "next/dist/client/router"
import React, { useEffect, useRef, useState } from "react"
import { ladder, note } from "types/rungs"
import styles from "styles/Ladder.module.scss"
import NotesList from "components/NotesList"
import { user } from "types/users"
import EditableLadderTitle from "components/EditableLadderTitle"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { cacheStateType, useCacheState } from "globalStates/useCacheStore"
import PageWrapper from "components/PageWrapper"
import LoadingOverlay from "components/LoadingOverlay"

export default function LadderPage() {
  const router = useRouter()
  const { user: author, ladder: ladderId } = router.query
  const authState: authStateType = useAuthState()
  const cacheState: cacheStateType = useCacheState()

  const [currentAuthorUser, setCurrentAuthorUser] = useState<user>()
  const [currentLadder, setCurrentLadder] = useState<ladder>()
  const [editingNoteId, setEditingNoteId] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  const _notMounted = useRef(false)

  useEffect(() => {
    return () => {
      _notMounted.current = true
    }
  }, [])

  useEffect(() => {
    getCurrentLadder()
  }, [author, ladderId])

  async function getCurrentLadder() {
    if (!author || !ladderId || currentLadder) return

    const { currentUser: cachedUser, currentLadder: cachedLadder } = cacheState
    if (cachedUser && cachedUser.displayName === author)
      setCurrentAuthorUser(cachedUser)
    if (cachedLadder && cachedLadder.id === ladderId)
      setCurrentLadder(cachedLadder)

    const retrievedUser = await UserController.getUser(author as string)
    if (!retrievedUser) return handleNotFound()
    cacheState.setState({
      currentUser: retrievedUser,
    })
    if (_notMounted.current) return
    setCurrentAuthorUser(retrievedUser)

    const retrievedLadder = await LadderController.getLadder(
      retrievedUser.uid,
      ladderId as string
    )
    if (!retrievedLadder) return handleNotFound()
    cacheState.setState({
      currentLadder: retrievedLadder,
    })
    if (_notMounted.current) return

    setCurrentLadder(retrievedLadder)
    setLoading(false)
  }

  function handleNotFound() {
    window.alert("Ladder not found")
    router.back()
  }

  function addNewNote(order: number) {
    const newNotes = [...currentLadder.notes]
    const newNote: note = {
      order,
      content: "",
      id: "new-note-" + Math.random(),
      new: true,
      author: currentLadder.author,
    }
    newNotes.splice(order, 0, newNote)
    updateLadderNotes(newNotes)
    setEditingNoteId(newNote.id)
  }

  function updateLadderNotes(newNotes: note[]) {
    const newLadder = { ...currentLadder }
    newLadder.notes = newNotes
    setCurrentLadder(newLadder)
  }

  function goToUser() {
    router.push(`/${currentAuthorUser.displayName}`)
  }

  async function handleChangeName(newName: string) {
    const accessToken = await authState.getAccessToken()
    if (!newName) {
      await LadderController.deleteLadder(currentLadder.id, accessToken)
      goToUser()
      return
    }
    const newLadder = { ...currentLadder }
    newLadder.name = newName
    await LadderController.editLadder(currentLadder.id, newName, accessToken)
  }

  function isUser() {
    if (!currentAuthorUser || !authState.uid) return false
    return currentAuthorUser.uid === authState.uid
  }

  return (
    <PageWrapper loading={loading}>
      {currentLadder && (
        <>
          <EditableLadderTitle
            onSubmit={handleChangeName}
            title={currentLadder.name}
          />
          <div className={styles.containerSpace}>
            <p onClick={goToUser}>{author}</p>
          </div>

          <NotesList
            notes={currentLadder.notes}
            editingNoteId={editingNoteId}
            setEditingNoteId={setEditingNoteId}
            updateNotes={updateLadderNotes}
            addNewNote={addNewNote}
            ladderId={currentLadder.id}
            loading={loading}
          />
        </>
      )}
    </PageWrapper>
  )
}
