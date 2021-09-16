import LadderController from "controllers/LadderController";
import UserController from "controllers/UserController";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { ladder, note } from "types/rungs";
import styles from "styles/Ladder.module.scss";
import NotesList from "components/NotesList";
import { user } from "types/users";
import EditableLadderTitle from "components/EditableLadderTitle";
import { authStateType, useAuthState } from "globalStates/useAuthStore";

export default function LadderPage() {
  const router = useRouter();
  const { user: author, ladder } = router.query;
  const authState: authStateType = useAuthState();

  const [currentAuthorUser, setCurrentAuthorUser] = useState<user>();
  const [currentLadder, setCurrentLadder] = useState<ladder>();
  const [editingNoteId, setEditingNoteId] = useState<string>();

  useEffect(() => {
    getCurrentLadder();
  }, [author, ladder]);

  async function getCurrentLadder() {
    if (!author || !ladder || currentLadder) return;
    const retrievedUser = await UserController.getUser(author as string);
    if (!retrievedUser) return handleNotFound();
    setCurrentAuthorUser(retrievedUser);
    const retrievedLadder = await LadderController.getLadder(
      retrievedUser.uid,
      ladder as string
    );
    if (!retrievedLadder) return handleNotFound();
    setCurrentLadder(retrievedLadder);
  }

  function handleNotFound() {
    window.alert("Ladder not found");
    router.back();
  }

  function addNewNote(order: number) {
    const newNotes = [...currentLadder.notes];
    const newNote: note = {
      order,
      content: "",
      id: "new-note-" + Math.random(),
      new: true,
      author: currentLadder.author,
    };
    newNotes.splice(order, 0, newNote);
    updateLadderNotes(newNotes);
    setEditingNoteId(newNote.id);
  }

  function updateLadderNotes(newNotes: note[]) {
    const newLadder = { ...currentLadder };
    newLadder.notes = newNotes;
    setCurrentLadder(newLadder);
  }

  function goToUser() {
    router.push(`/${currentAuthorUser.displayName}`);
  }

  async function handleChangeName(newName: string) {
    const accessToken = await authState.getAccessToken();
    if (!newName) {
      await LadderController.deleteLadder(currentLadder.id, accessToken);
      goToUser();
      return;
    }
    const newLadder = { ...currentLadder };
    newLadder.name = newName;
    await LadderController.editLadder(currentLadder.id, newName, accessToken);
  }

  if (!currentLadder) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <p onClick={goToUser}>userId: {currentLadder.author}</p>
      <EditableLadderTitle
        onSubmit={handleChangeName}
        title={currentLadder.name}
      />

      {(!currentLadder.notes || !currentLadder.notes.length) && (
        <button onClick={() => addNewNote(0)}>Add note</button>
      )}
      <NotesList
        notes={currentLadder.notes}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
        updateNotes={updateLadderNotes}
        addNewNote={addNewNote}
        ladderId={currentLadder.id}
      />
    </div>
  );
}
