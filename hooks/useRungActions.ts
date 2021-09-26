import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { rung } from "types/rungs";

export default function useRungActions(
  parentRung: rung,
  setParentRung: (newRung: rung) => void,
  rungList: rung[],
  setRungList: (newRungs: rung[]) => void
) {
  const authState: authStateType = useAuthState();

  function isAuthor(author: string) {
    if (!authState.uid) return false;
    return authState.uid === author;
  }

  async function createNewRung(order: number) {
    const newRungs = [...rungList];
    const newRung: rung = {
      id: "new-rung-" + Math.random(),
      alias: parentRung.countChildren,
      content: parentRung.countChildren + "rung",
      parent: parentRung.id,
      order,
      countChildren: 0,
      author: authState.uid,
      new: true,
    };
    newRungs.splice(order, 0, newRung);
    setRungList(newRungs);

    const newParentRung = {
      ...parentRung,
      countChildren: parentRung.countChildren + 1,
    };

    setParentRung(newParentRung);
  }

  async function editRung() {}

  async function reorderRung(movingRungId: string, droppedSpacer: number) {
    const newRungs = [...rungList];
    const rungIndex = newRungs.findIndex((e) => e.id === movingRungId);
    const rungToMove = newRungs[rungIndex];
    if (!isAuthor(rungToMove.author)) return;

    const oldOrder = rungIndex;
    const newOrder = droppedSpacer + 1;
    if (oldOrder === newOrder) return;

    // Replace moving rung with unique temp rung
    const tempRung: rung = {
      id: "temp-rung",
      alias: 0,
      content: "",
      parent: "",
      order: 0,
      countChildren: 0,
      author: authState.uid,
    };
    newRungs.splice(rungIndex, 1, tempRung);

    // Add rung in place
    newRungs.splice(newOrder, 0, rungToMove);

    // Delete tempRung
    newRungs.splice(
      newRungs.findIndex((e) => e.id === tempRung.id),
      1
    );

    // Fix everyone's orders
    newRungs.forEach((rung, index) => {
      rung.order = index;
    });
    setRungList(newRungs);
  }

  async function deleteRung() {}

  return { createNewRung, editRung, reorderRung, deleteRung };
}
