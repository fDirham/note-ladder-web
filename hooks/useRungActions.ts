import customErrors, { customErrorObj } from "components/constants/errors";
import RungController from "controllers/RungController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import { useEffect, useRef } from "react";
import { rung } from "types/rungs";
import { createParenthesizedType } from "typescript";
import { cursorControls } from "./useCursor";

export default function useRungActions(
  parentRung: rung,
  setParentRung: (newRung: rung) => void,
  rungList: rung[],
  setRungList: (newRungs: rung[]) => void,
  handleError: (error: customErrorObj) => void,
  cursorControls: cursorControls
) {
  const authState: authStateType = useAuthState();
  const router = useRouter();
  const { cursor, prevCursor, incrementCursor, setCursor } = cursorControls;

  const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reorderTimeoutFunctionRef = useRef<() => void>();

  useEffect(() => {
    return () => {
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current);
        const { current: timeoutFunction } = reorderTimeoutFunctionRef;
        if (timeoutFunction) timeoutFunction();
      }
    };
  }, []);

  function isAuthor(author: string) {
    if (!authState.uid) return false;
    return authState.uid === author;
  }

  function fixRungListOrder(newRungs: rung[]) {
    const orderArray = [];
    newRungs.forEach((rung, index) => {
      rung.order = index;
      orderArray.push(rung.alias);
    });

    return orderArray;
  }

  function createNewRung(order: number) {
    if (rungList.length === 1 && rungList[0].new) return;
    const newRungs = [...rungList];
    const newRung: rung = {
      id: "new-rung-" + Math.random(),
      alias: parentRung.countChildren,
      content: "",
      parent: parentRung.id,
      order,
      countChildren: 0,
      trueCountChildren: 0,
      author: authState.uid,
      new: true,
    };
    newRungs.splice(order, 0, newRung);
    fixRungListOrder(newRungs);
    setRungList(newRungs);

    const newParentRung = {
      ...parentRung,
      countChildren: parentRung.countChildren + 1,
      trueCountChildren: parentRung.trueCountChildren + 1,
    };
    setParentRung(newParentRung);

    return newRung;
  }

  async function editRung(editedRung: rung) {
    if (!editedRung.content) return await deleteRung(editedRung.id);
    const newRungs = [...rungList];
    const rungIndex = newRungs.findIndex((e) => e.id === editedRung.id);
    const oldRung = newRungs[rungIndex];
    if (oldRung.content === editedRung.content) return;

    const accessToken = await authState.getAccessToken();
    if (editedRung.new) {
      const savedRung = await RungController.createRung(
        editedRung.content,
        editedRung.order,
        editedRung.parent,
        accessToken
      );
      if (!savedRung) return handleError(customErrors.FAILED_CREATE);
      editedRung.id = savedRung.id;
      editedRung.new = undefined;
    } else {
      const modifiedRung = await RungController.editRung(
        editedRung.id,
        editedRung.content,
        accessToken
      );
      if (!modifiedRung) return handleError(customErrors.FAILED_EDIT);
    }

    newRungs[rungIndex] = editedRung;
    setRungList(newRungs);

    return editedRung;
  }

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
      trueCountChildren: 0,
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

    const orderArray = fixRungListOrder(newRungs);
    setRungList(newRungs);

    const actualNewOrder = newRungs.findIndex((e) => e.id === rungToMove.id);
    rungToMove.order = actualNewOrder;
    if (oldOrder === actualNewOrder) return;
    setCursor(actualNewOrder);

    // Set time out to apply changes
    applyDelayedReorder(rungToMove.parent, orderArray);

    return rungToMove;
  }

  async function applyDelayedReorder(parentId: string, orderArray: number[]) {
    // Set time out to apply changes
    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current);
    }
    const reorderTimeoutMs = 3000;
    const accessToken = await authState.getAccessToken();

    reorderTimeoutFunctionRef.current = () => {
      RungController.reorderRungChildren(parentId, orderArray, accessToken);
    };

    reorderTimeoutRef.current = setTimeout(async () => {
      RungController.reorderRungChildren(parentId, orderArray, accessToken);
      reorderTimeoutRef.current = undefined;
    }, reorderTimeoutMs);
  }

  async function deleteRung(rungId: string) {
    if (rungList.length === 1 && rungList[0].new) return;

    const newRungs = [...rungList];
    const rungIndex = newRungs.findIndex((e) => e.id === rungId);
    const rungToDelete = newRungs[rungIndex];

    newRungs.splice(rungIndex, 1);
    fixRungListOrder(newRungs);
    setRungList(newRungs);
    if (rungIndex < prevCursor) setCursor(prevCursor - 1);
    else setCursor(prevCursor);

    const newParentRung = {
      ...parentRung,
      trueCountChildren: parentRung.trueCountChildren - 1,
    };
    setParentRung(newParentRung);

    if (!rungToDelete.new) {
      const accessToken = await authState.getAccessToken();
      const deletedRung = await RungController.deleteRung(
        rungToDelete.id,
        accessToken
      );
      if (!deletedRung) return handleError(customErrors.FAILED_DELETE);
    }

    return newRungs;
  }

  return { createNewRung, editRung, reorderRung, deleteRung };
}
