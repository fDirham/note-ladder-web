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
  deleteRung: (rungId: string) => void
}

export default function useKeyboardControls(
  cursor: number,
  incrementCursor: (increment: number) => void,
  editingRung: boolean,
  loading: boolean,
  rungs: rung[],
  keyboardFunctions: keyboardFunctions
) {
  useKeyTap("ArrowRight", handleRight)
  useKeyTap("ArrowLeft", handleLeft)
  useKeyTap("e", handleE)
  useKeyTap("d", handleD)
  useKeyTap("Escape", handleEscape)
  useKeyTap("Enter", handleEnter)
  useKeyTap(" ", handleSpace)
  const shift = useKeyHold("Shift")

  const selectedRung = rungs[cursor]
  const noEffect = editingRung || !selectedRung || loading
  function handleEscape() {
    if (!editingRung) return keyboardFunctions.goBack()
    keyboardFunctions.cancelEdit()
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
    if (editingRung || loading) return
    if (!selectedRung) return keyboardFunctions.addNewRung(0)
    const increment = shift ? 0 : 1
    keyboardFunctions.addNewRung(cursor + increment)
  }

  function handleD() {
    if (noEffect) return
    keyboardFunctions.deleteRung(selectedRung.id)
  }

  function handleE() {
    if (noEffect) return
    keyboardFunctions.editRung(selectedRung)
  }

  function handleSpace() {
    if (noEffect) return
    keyboardFunctions.enterRung(selectedRung)
  }

  return null
}
