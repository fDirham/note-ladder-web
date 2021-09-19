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
  let incrementCursor: (incrementBy: number) => void

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

  function wrappedIncrementCursor(incrementBy: number) {
    let newCursor = cursor + incrementBy
    if (newCursor < 0) newCursor = maxLength - 1
    if (newCursor >= maxLength) newCursor = 0
    const toIncrement = newCursor - cursor
    incrementCursor(toIncrement)
  }

  useEffect(() => {
    if (disabled || !maxLength) return
    let cursorPress = upPress || downPress
    if (upPress) {
      wrappedIncrementCursor(-1)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              wrappedIncrementCursor(-1)
            }, intervalMs)
        }, timeoutMs)
    }

    if (downPress) {
      wrappedIncrementCursor(1)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              wrappedIncrementCursor(1)
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
