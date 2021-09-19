import { useEffect, useRef, useState } from "react"
import { rung } from "types/rungs"
import useKeyHold from "./useKeyHold"
import useKeyTap from "./useKeyTap"

export type keyboardFunctions = {
  enterRung: (rung: rung) => void
  editRung: (rung: rung) => void
  cancelEdit: () => void
  goBack: () => void
  addNewRung: (order: number) => void
}
export default function useKeyboardControls(
  cursor: number,
  incrementCursor: (increment: number) => void,
  editingRung: boolean,
  rungs: rung[],
  keyboardFunctions: keyboardFunctions
) {
  useKeyTap("ArrowRight", handleRight)
  useKeyTap("ArrowLeft", handleLeft)
  useKeyTap("e", handleE)
  useKeyTap("Escape", handleEscape)
  useKeyTap("Enter", handleEnter)
  const shift = useKeyHold("Shift")

  const selectedRung = rungs[cursor]
  const noEffect = editingRung || !selectedRung
  function handleEscape() {
    if (!editingRung) return keyboardFunctions.goBack()
    keyboardFunctions.cancelEdit()
  }

  function handleE() {
    if (noEffect) return
    keyboardFunctions.editRung(selectedRung)
  }

  function handleRight() {
    if (noEffect) return
    keyboardFunctions.enterRung(selectedRung)
  }

  function handleLeft() {
    if (editingRung) return
    keyboardFunctions.goBack()
  }

  function handleEnter() {
    if (editingRung) return
    if (!selectedRung) keyboardFunctions.addNewRung(0)
    const increment = shift ? 0 : 1
    keyboardFunctions.addNewRung(cursor + increment)
  }

  return null
}
