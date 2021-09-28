import create, { GetState, SetState } from "zustand"
import { devtools, persist } from "zustand/middleware"
import * as R from "ramda"
import { setRung } from "./actions/cursorMapActions"

type cursorMap = { [rungId: string]: number }
export type cursorMapStateType = {
  cursorMap: cursorMap
  setRung: (rungId: string, cursor: number) => cursorMap
  setState: SetState<cursorMapStateType>
  getState: GetState<cursorMapStateType>
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

const createStore = R.pipe(log, devtools, create)

export const initialStoreValues = {
  cursorMap: { main: 0 },
}

export const useCursorMapState = createStore(
  (
    set: SetState<cursorMapStateType>,
    get: GetState<cursorMapStateType>
  ): cursorMapStateType => ({
    cursorMap: initialStoreValues.cursorMap,
    setRung: (rungId: string, cursor: number) =>
      setRung(set, get, rungId, cursor),
    setState: set,
    getState: get,
    resetState: () => set(initialStoreValues),
  })
)
