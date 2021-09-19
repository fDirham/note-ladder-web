import { useEffect, useRef, useState } from "react"
import useKeyHold from "./useKeyHold"

const timeoutMs = 750
const intervalMs = 80
export default function useRungCursor(maxLength: number, disabled: boolean) {
  const [cursor, _setCursor] = useState<number>(0) // order being selected
  const cursorRef = useRef(cursor)
  function setCursor(newCursor: number) {
    cursorRef.current = newCursor
    _setCursor(newCursor)
  }
  const cursorMoveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const cursorMoveIntervalRef = useRef<ReturnType<typeof setInterval>>()

  const upPress = useKeyHold("ArrowUp")
  const downPress = useKeyHold("ArrowDown")

  useEffect(() => {
    if (disabled || !maxLength) return
    let cursorPress = upPress || downPress
    if (upPress) {
      incrementCursor(-1)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(-1)
            }, intervalMs)
        }, timeoutMs)
    }

    if (downPress) {
      incrementCursor(1)
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(1)
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

  function incrementCursor(increment: number) {
    let newCursor = cursorRef.current + increment
    if (newCursor < 0) newCursor = 0
    if (newCursor >= maxLength) newCursor = maxLength - 1
    setCursor(newCursor)
  }

  return { cursor, incrementCursor }
}
