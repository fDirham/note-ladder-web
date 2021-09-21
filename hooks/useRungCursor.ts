import { cursorStateType, useCursorState } from "globalStates/useCursorStore"
import { useEffect, useRef, useState } from "react"
import useKeyHold from "./useKeyHold"

const timeoutMs = 750
const intervalMs = 80
export type cursorTypes = "ladder" | "note"
export default function useRungCursor(
  type: cursorTypes,
  maxLength: number,
  disabled: boolean
) {
  const cursorState: cursorStateType = useCursorState()
  const {
    noteCursor,
    incrementNoteCursor,
    ladderCursor,
    incrementLadderCursor,
    setState,
  } = cursorState

  let cursor: number
  let incrementCursor: (incrementBy: number, maxLength?: number) => void

  switch (type) {
    case "ladder":
      cursor = ladderCursor
      incrementCursor = incrementLadderCursor
      break
    case "note":
      cursor = noteCursor
      incrementCursor = incrementNoteCursor
      break
  }

  const cursorMoveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const cursorMoveIntervalRef = useRef<ReturnType<typeof setInterval>>()

  const upPress = useKeyHold("ArrowUp")
  const downPress = useKeyHold("ArrowDown")
  const shift = useKeyHold("Shift")

  useEffect(() => {
    if (disabled || !maxLength) return
    let cursorPress = upPress || downPress
    if (shift) {
      if (upPress) {
        incrementCursor(-cursor)
      }
      if (downPress) {
        incrementCursor(maxLength - cursor - 1)
      }
      return
    }
    if (upPress) {
      incrementCursor(-1, maxLength)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(-1, maxLength)
            }, intervalMs)
        }, timeoutMs)
    }

    if (downPress) {
      incrementCursor(1, maxLength)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(1, maxLength)
            }, intervalMs)
        }, timeoutMs)
    }

    if (!cursorPress) {
      if (cursorMoveTimeoutRef.current) {
        clearTimeout(cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = undefined
      }
      if (cursorMoveIntervalRef.current) {
        clearInterval(cursorMoveIntervalRef.current)
        cursorMoveIntervalRef.current = undefined
      }
    }
  }, [upPress, downPress])

  return { cursor, incrementCursor }
}
