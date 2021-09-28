import create, { GetState, SetState } from "zustand"
import { devtools, persist } from "zustand/middleware"
import * as R from "ramda"

type cachedCursorTable = {}
export type cacheStateType = {
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

export const initialStoreValues = {}

export const useCacheState = createStore(
  persist(
    (
      set: SetState<cacheStateType>,
      get: GetState<cacheStateType>
    ): cacheStateType => ({
      setState: set,
      getState: get,
      resetState: () => set(initialStoreValues),
    }),
    {
      name: "cache",
    }
  )
)
