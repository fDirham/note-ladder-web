import { useEffect, useRef, useState } from "react";
import { rung } from "types/rungs";
import useKeyHold from "./useKeyHold";
import useKeyTap from "./useKeyTap";

export type keyboardFunctions = {
  enterRung: (rungId: string) => void;
  setRungToEdit: (rungId: string) => void;
  cancelEdit: () => void;
  goBack: () => void;
  addNewRung: (order: number) => void;
  deleteRung: (rungId: string) => void;
  setMovingRungId: (rungId: string) => void;
  setDroppedSpacer: (prevOrder: number) => void;
};

export enum specialKeys {
  MOVE_KEY = "a",
}
export default function useKeyboardControls(
  rungs: rung[],
  cursor: number,
  editingRung: boolean,
  loading: boolean,
  keyboardFunctions: keyboardFunctions
) {
  useKeyTap("ArrowUp", handleUp);
  useKeyTap("ArrowDown", handleDown);
  useKeyTap("ArrowRight", handleRight);
  useKeyTap("ArrowLeft", handleLeft);
  useKeyTap("Escape", handleEscape);
  useKeyTap("Enter", handleEnter);
  useKeyTap(" ", handleSpace);
  useKeyTap("d", handleD);
  useKeyTap("e", handleE);
  useKeyTap("i", handleI);
  useKeyTap("o", handleO);
  useKeyTap("O", handleUpO);
  const moveKey = useKeyHold(specialKeys.MOVE_KEY);

  const selectedRung = rungs[cursor];
  const noEffect = editingRung || !selectedRung || loading;

  function handleUp() {
    if (noEffect) return;
    if (moveKey) {
      keyboardFunctions.setMovingRungId(selectedRung.id);
      let toDropAt = cursor - 2;
      if (toDropAt < -1) toDropAt = rungs.length - 1;
      keyboardFunctions.setDroppedSpacer(toDropAt);
    }
  }

  function handleDown() {
    if (noEffect) return;
    if (moveKey) {
      keyboardFunctions.setMovingRungId(selectedRung.id);
      let toDropAt = cursor + 1;
      if (toDropAt > rungs.length - 1) toDropAt = -1;
      keyboardFunctions.setDroppedSpacer(toDropAt);
    }
  }

  function handleRight() {
    if (noEffect) return;
    keyboardFunctions.enterRung(selectedRung.id);
  }

  function handleLeft() {
    if (editingRung) return;
    keyboardFunctions.goBack();
  }

  function handleEscape() {
    if (!editingRung) return keyboardFunctions.goBack();
    keyboardFunctions.cancelEdit();
  }

  function handleEnter() {
    if (noEffect) return;
    keyboardFunctions.enterRung(selectedRung.id);
  }

  function handleSpace() {
    if (noEffect) return;
    keyboardFunctions.enterRung(selectedRung.id);
  }

  function handleD() {
    if (noEffect) return;
    keyboardFunctions.deleteRung(selectedRung.id);
  }

  function handleE() {
    if (noEffect) return;
    keyboardFunctions.setRungToEdit(selectedRung.id);
  }

  function handleI() {
    if (noEffect) return;
    keyboardFunctions.setRungToEdit(selectedRung.id);
  }

  function handleO() {
    if (editingRung || loading) return;
    if (!selectedRung) return keyboardFunctions.addNewRung(0);
    keyboardFunctions.addNewRung(cursor + 1);
  }

  function handleUpO() {
    if (editingRung || loading) return;
    if (!selectedRung) return keyboardFunctions.addNewRung(0);
    keyboardFunctions.addNewRung(cursor);
  }

  return { moveKey };
}
