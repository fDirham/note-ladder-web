import { cacheStateType } from "globalStates/useCacheStore";
import { rung } from "types/rungs";
import { user } from "types/users";
import { GetState, SetState } from "zustand";

export function setCachedRungRow(
  set: SetState<cacheStateType>,
  get: GetState<cacheStateType>,
  ladderId: string,
  parentRung?: rung,
  rungList?: rung[],
  currentUser?: user
) {
  const newMap = { ...get().cachedRungTable };
  if (!parentRung && !rungList && !currentUser) {
    delete newMap[ladderId];
  } else {
    newMap[ladderId] = { parentRung, rungList, currentUser };
  }

  set({ cachedRungTable: newMap });
  return newMap;
}
