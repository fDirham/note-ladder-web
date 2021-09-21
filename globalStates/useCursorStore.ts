import create, { GetState, SetState } from "zustand"
import { devtools } from "zustand/middleware"

export type cursorStateType = {
  ladderCursor: number
  incrementLadderCursor: (incrementBy: number, maxLength?: number) => number
  noteCursor: number
  incrementNoteCursor: (incrementBy: number, maxLength?: number) => number
  setState: SetState<cursorStateType>
  getState: GetState<cursorStateType>
  resetState: () => void
}

// Log every time state is changed
const log: typeof devtools = (config) => (set, get, api) =>
  config(
    (args) => {
      // console.log("Z: old state", get());
      // console.log("Z: applying", args);
      set(args)
      // console.log("Z: new state", get());
    },
    get,
    api
  )

const createStore = create

export const initialStoreValues = {
  ladderCursor: 0,
  noteCursor: 0,
}

export const useCursorState = createStore(
  (
    set: SetState<cursorStateType>,
    get: GetState<cursorStateType>
  ): cursorStateType => ({
    ladderCursor: initialStoreValues.ladderCursor,
    incrementLadderCursor: (incrementBy: number, maxLength?: number) => {
      let newCursor = get().ladderCursor + incrementBy
      // Wrapped
      if (maxLength) {
        if (newCursor < 0) newCursor = maxLength - 1
        if (newCursor >= maxLength) newCursor = 0
      }
      set({ ladderCursor: newCursor })
      return newCursor
    },
    noteCursor: initialStoreValues.noteCursor,
    incrementNoteCursor: (incrementBy: number, maxLength?: number) => {
      let newCursor = get().noteCursor + incrementBy
      // Wrapped
      if (maxLength) {
        if (newCursor < 0) newCursor = maxLength - 1
        if (newCursor >= maxLength) newCursor = 0
      }
      set({ noteCursor: newCursor })
      return newCursor
    },
    setState: set,
    getState: get,
    resetState: () => set(initialStoreValues),
  })
)
