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
  rungs: rung[],
  disabled: boolean,
  keyboardFunctions: keyboardFunctions
) {
  useKeyTap("ArrowRight", handleRight)
  useKeyTap("ArrowLeft", handleLeft)
  useKeyTap("e", handleE)
  useKeyTap("Escape", handleEscape)
  useKeyTap("Enter", handleEnter)
  const shift = useKeyHold("Shift")

  const selectedRung = rungs[cursor]
  const noEffect = disabled || !selectedRung
  function handleEscape() {
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
    if (disabled) return
    keyboardFunctions.goBack()
  }

  function handleEnter() {
    if (noEffect) return
    const increment = shift ? 0 : 1
    keyboardFunctions.addNewRung(cursor + increment)
  }

  return null
}
