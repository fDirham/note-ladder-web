import { cursorMapStateType } from "globalStates/useCursorMapStore"
import { GetState, SetState } from "zustand"

export function setRung(
  set: SetState<cursorMapStateType>,
  get: GetState<cursorMapStateType>,
  rungId: string,
  cursor: number
) {
  const newMap = { ...get().cursorMap }
  //   if (rungId === "") rungId = "main"
  if (cursor === -1) {
    delete newMap[rungId]
  } else {
    newMap[rungId] = cursor
  }
  set({ cursorMap: newMap })
  return newMap
}
