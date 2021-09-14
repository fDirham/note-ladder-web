// import NoteController from "controllers/NoteController";
import React, { useEffect } from "react";
import {
  note,
  notesToRungs,
  rung,
  rungsToNotes,
  rungToNote,
} from "types/rungs";
import RungsList from "./RungsList";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import { validateAlphanumeric } from "utilities/validation";

type NotesListProps = {
  notes: note[];
  updateNotes?: (newNotes: note[]) => void;
  addNewNote?: (order: number) => void;
  editingNoteId: string;
  setEditingNoteId: (newId: string) => void;
};

export default function NotesList(props: NotesListProps) {
  const router = useRouter();
  const authState: authStateType = useAuthState();
  useEffect(() => {}, [props.notes]);

  function updateRungs(newRungs: rung[]) {
    props.updateNotes(rungsToNotes(newRungs));
  }

  function addNewRung(order: number) {
    props.addNewNote(order);
  }

  function onRungClick(rung: rung) {}

  async function saveNewRung(newRung: rung) {
    const newNote = rungToNote(newRung);
    try {
      const accessToken = await authState.getAccessToken();
      // const createdNote = await NoteController.createNote(
      //   newNote.name,
      //   newNote.order,
      //   accessToken
      // );
      // if (!createdNote.id) return null;
      // return createdNote;
    } catch (error) {
      return null;
    }
  }

  function rungValidator(rung: rung) {
    return rung.content.length < 30;
  }

  return (
    <RungsList
      rungs={notesToRungs(props.notes)}
      updateRungs={updateRungs}
      addNewRung={addNewRung}
      saveNewRung={saveNewRung}
      onRungClick={onRungClick}
      editingRungId={props.editingNoteId}
      setEditingRungId={props.setEditingNoteId}
      rungValidator={rungValidator}
    />
  );
}
