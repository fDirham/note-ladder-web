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
import NoteController from "controllers/NoteController";
import { maxNoteContentLength } from "utilities/constants";

type NotesListProps = {
  notes: note[];
  updateNotes: (newNotes: note[]) => void;
  addNewNote: (order: number) => void;
  editingNoteId: string;
  setEditingNoteId: (newId: string) => void;
  ladderId: string;
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

  function handleRungClick(rung: rung) {
    props.setEditingNoteId(rung.id);
  }

  function rungValidator(rung: rung) {
    return rung.content.length <= maxNoteContentLength;
  }

  async function saveNewRung(newRung: rung) {
    const newNote = rungToNote(newRung);
    try {
      const accessToken = await authState.getAccessToken();
      const createdNote = await NoteController.createNote(
        newNote.content,
        newNote.order,
        props.ladderId,
        accessToken
      );
      if (!createdNote.id) return null;
      return createdNote;
    } catch (error) {
      return null;
    }
  }

  async function handleEdit(newRung: rung) {
    const accessToken = await authState.getAccessToken();
    await NoteController.editNote(
      newRung.id,
      props.ladderId,
      newRung.content,
      accessToken
    );
  }

  async function handleRungMove(rung: rung) {
    const accessToken = await authState.getAccessToken();
    await NoteController.reorderNote(
      rung.id,
      props.ladderId,
      rung.order,
      accessToken
    );
  }

  return (
    <RungsList
      rungs={notesToRungs(props.notes)}
      updateRungs={updateRungs}
      addNewRung={addNewRung}
      saveNewRung={saveNewRung}
      onRungClick={handleRungClick}
      editingRungId={props.editingNoteId}
      setEditingRungId={props.setEditingNoteId}
      rungValidator={rungValidator}
      onRungMove={handleRungMove}
      onEdit={handleEdit}
    />
  );
}
