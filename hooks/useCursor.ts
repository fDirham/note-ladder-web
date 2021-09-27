import { useEffect, useRef, useState } from "react";
import { specialKeys } from "./useKeyboardControls";
import useKeyHold from "./useKeyHold";

const timeoutMs = 750;
const intervalMs = 80;
export type cursorControls = {
  cursor: number;
  prevCursor: number;
  setCursor: (newCursor: number) => void;
  incrementCursor: (incrementBy: number) => void;
};

export default function useCursor(
  maxLength: number,
  disabled: boolean
): cursorControls {
  const [prevCursor, _setPrevCursor] = useState<number>(0);
  const prevCursorRef = useRef(prevCursor);

  function setPrevCursor(newCursor: number) {
    prevCursorRef.current = newCursor;
    _setPrevCursor(newCursor);
  }

  const [cursor, _setCursor] = useState<number>(0);
  const cursorRef = useRef(cursor);

  function setCursor(newCursor: number) {
    setPrevCursor(cursorRef.current);
    cursorRef.current = newCursor;
    _setCursor(newCursor);
  }

  function incrementCursor(incrementBy: number) {
    let newCursor = cursorRef.current + incrementBy;
    if (newCursor >= maxLength) newCursor = 0;
    if (newCursor < 0) newCursor = maxLength - 1;
    setCursor(newCursor);
  }

  const cursorMoveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const cursorMoveIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const upPress = useKeyHold("ArrowUp");
  const downPress = useKeyHold("ArrowDown");
  const shift = useKeyHold("Shift");
  const moveKey = useKeyHold(specialKeys.MOVE_KEY);

  useEffect(() => {
    if (disabled || !maxLength || moveKey) return;
    let cursorPress = upPress || downPress;
    if (shift) {
      if (upPress) {
        incrementCursor(-cursor);
      }
      if (downPress) {
        incrementCursor(maxLength - cursor - 1);
      }
      return;
    }
    if (upPress) {
      incrementCursor(-1);
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(-1);
            }, intervalMs);
        }, timeoutMs);
    }

    if (downPress) {
      incrementCursor(1);
      if (!cursorMoveTimeoutRef.current)
        cursorMoveTimeoutRef.current = setTimeout(() => {
          if (!cursorMoveIntervalRef.current)
            cursorMoveIntervalRef.current = setInterval(() => {
              incrementCursor(1);
            }, intervalMs);
        }, timeoutMs);
    }

    if (!cursorPress) {
      if (cursorMoveTimeoutRef.current) {
        clearTimeout(cursorMoveTimeoutRef.current);
        cursorMoveTimeoutRef.current = undefined;
      }
      if (cursorMoveIntervalRef.current) {
        clearInterval(cursorMoveIntervalRef.current);
        cursorMoveIntervalRef.current = undefined;
      }
    }

    return () => {
      if (cursorMoveTimeoutRef.current) {
        clearTimeout(cursorMoveTimeoutRef.current);
        cursorMoveTimeoutRef.current = undefined;
      }
      if (cursorMoveIntervalRef.current) {
        clearInterval(cursorMoveIntervalRef.current);
        cursorMoveIntervalRef.current = undefined;
      }
    };
  }, [upPress, downPress]);

  return {
    cursor: cursorRef.current,
    prevCursor: prevCursorRef.current,
    incrementCursor,
    setCursor,
  };
}
