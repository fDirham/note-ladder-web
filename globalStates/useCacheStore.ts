import create, { GetState, SetState } from "zustand";
import { devtools, persist } from "zustand/middleware";
import * as R from "ramda";
import { rung } from "types/rungs";
import { user } from "types/users";
import { setCachedRungRow } from "./actions/cacheStoreActions";

type cachedRungRow = {
  parentRung: rung;
  rungList: rung[];
  currentUser?: user;
};
type cachedRungTable = { [ladderId: string]: cachedRungRow };
export type cacheStateType = {
  cachedRungTable: cachedRungTable;
  setCachedRungRow: (
    ladderId: string,
    parentRung: rung,
    rungList: rung[],
    currentUser?: user
  ) => cachedRungTable;
  setState: SetState<cacheStateType>;
  getState: GetState<cacheStateType>;
  resetState: () => void;
};

// Log every time state is changed
const log: typeof devtools = (config) => (set, get, api) =>
  config(
    (args) => {
      // console.log("Z: old state", get());
      // console.log("Z: applying", args);
      set(args);
      // console.log("Z: new state", get());
    },
    get,
    api
  );

const createStore = R.pipe(log, devtools, create);

export const initialStoreValues = {
  cachedRungTable: {},
};

export const useCacheState = createStore(
  persist(
    (
      set: SetState<cacheStateType>,
      get: GetState<cacheStateType>
    ): cacheStateType => ({
      cachedRungTable: initialStoreValues.cachedRungTable,
      setCachedRungRow: (
        ladderId: string,
        parentRung: rung,
        rungList: rung[],
        currentUser?: user
      ) =>
        setCachedRungRow(set, get, ladderId, parentRung, rungList, currentUser),
      setState: set,
      getState: get,
      resetState: () => set(initialStoreValues),
    }),
    {
      name: "cache",
    }
  )
);
