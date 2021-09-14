import create, { GetState, SetState } from "zustand";
import { devtools, persist } from "zustand/middleware";
import * as R from "ramda";
import { getAccessToken } from "./actions/authActions";

export type authStateType = {
  displayName?: string;
  uid?: string;
  accessToken?: string;
  getAccessToken: () => Promise<string>;
  setState: SetState<authStateType>;
  getState: GetState<authStateType>;
  resetState: () => void;
};

// Log every time state is changed
const log: typeof devtools = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log("Z: old state", get());
      console.log("Z: applying", args);
      set(args);
      console.log("Z: new state", get());
    },
    get,
    api
  );

const createStore = R.pipe(log, devtools, create);

export const initialStoreValues = {
  displayName: "",
  uid: "",
  accessToken: "",
};

export const useAuthState = createStore(
  persist(
    (
      set: SetState<authStateType>,
      get: GetState<authStateType>
    ): authStateType => ({
      displayName: initialStoreValues.displayName,
      uid: initialStoreValues.uid,
      accessToken: initialStoreValues.accessToken,
      getAccessToken: getAccessToken,
      setState: set,
      getState: get,
      resetState: () => set(initialStoreValues),
    }),
    {
      name: "auth",
    }
  )
);
