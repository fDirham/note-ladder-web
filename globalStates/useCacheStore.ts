import create, { GetState, SetState } from "zustand"
import { devtools, persist } from "zustand/middleware"
import * as R from "ramda"
import { ladder, note } from "types/rungs"

export type cacheStateType = {
  currentDisplayName?: string
  ladders?: ladder[]
  currentLadder?: string
  notes?: note[]
  setState: SetState<cacheStateType>
  getState: GetState<cacheStateType>
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
  currentDisplayName: "",
  ladders: [],
  currentLadder: "",
  notes: [],
}

export const useCacheState = createStore(
  persist(
    (
      set: SetState<cacheStateType>,
      get: GetState<cacheStateType>
    ): cacheStateType => ({
      currentDisplayName: initialStoreValues.currentDisplayName,
      ladders: initialStoreValues.ladders,
      currentLadder: initialStoreValues.currentLadder,
      notes: initialStoreValues.notes,
      setState: set,
      getState: get,
      resetState: () => set(initialStoreValues),
    }),
    {
      name: "cache",
    }
  )
)
