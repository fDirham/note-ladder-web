import { customErrorObj } from "components/constants/errors";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import useCursor from "hooks/useCursor";
import useRungCursor from "hooks/useCursor";
import useKeyboardControls from "hooks/useKeyboardControls";
import useRungActions from "hooks/useRungActions";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { rung } from "types/rungs";
import RungsListView from "./RungListView";

type RungListContainerProps = {
  rungList: rung[];
  setRungList: (newRungs: rung[]) => void;
  parentRung: rung;
  setParentRung: (newRung: rung) => void;
  loading: boolean;
};

export default function RungListContainer(props: RungListContainerProps) {
  const [movingRungId, setMovingRungId] = useState<string>(); // Id of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>(); // prevOrder
  const [editingRungId, setEditingRungId] = useState<string>(); // Id of editing rung

  const router = useRouter();

  const cursorControls = useCursor(props.rungList.length, false);
  const { cursor, setCursor } = cursorControls;

  const { moveKey } = useKeyboardControls(
    props.rungList,
    cursor,
    !!editingRungId,
    props.loading,
    {
      enterRung,
      setRungToEdit,
      cancelEdit: () => setRungToEdit(undefined),
      goBack: () => router.back(),
      addNewRung,
      deleteRung: handleRungDelete,
      setMovingRungId,
      setDroppedSpacer,
    }
  );

  const rungActions = useRungActions(
    props.parentRung,
    props.setParentRung,
    props.rungList,
    props.setRungList,
    handleError,
    cursorControls
  );

  useEffect(() => {
    if (!props.loading && props.rungList && !props.rungList.length) {
      addNewRung(0);
    }
  }, [props.rungList, props.loading]);

  useEffect(() => {
    if (movingRungId && typeof droppedSpacer === "number") handleMove();
  }, [droppedSpacer, movingRungId]);

  function handleError(customErrorObj: customErrorObj) {
    window.alert(customErrorObj.text);
  }

  function addNewRung(order: number) {
    const newRung = rungActions.createNewRung(order);
    if (newRung) return setRungToEdit(newRung);
    if (props.rungList.length) setRungToEdit(props.rungList[0]);
  }

  async function handleMove() {
    await rungActions.reorderRung(movingRungId, droppedSpacer);
    setMovingRungId(undefined);
    setDroppedSpacer(undefined);
  }

  function handleRungClick(rung: rung) {
    if (!rung.new) enterRung(rung);
    else setRungToEdit(rung);
  }

  function setRungToEdit(rung?: rung) {
    if (!rung) {
      setEditingRungId(undefined);
      return;
    }
    setCursor(rung.order);
    setEditingRungId(rung.id);
  }

  function enterRung(rung: rung) {
    const { user } = router.query;
    router.push(`/${user}/${rung.id}`);
  }

  async function handleRungEdit(editedRung: rung) {
    setEditingRungId(undefined);
    await rungActions.editRung(editedRung);
  }

  async function handleRungDelete(rung: rung) {
    await rungActions.deleteRung(rung.id);
  }

  return (
    <RungsListView
      rungs={props.rungList}
      setDroppedSpacer={setDroppedSpacer}
      setMovingRungId={setMovingRungId}
      editingRungId={editingRungId}
      onRungClick={handleRungClick}
      onRungEdit={handleRungEdit}
      onRungDelete={handleRungDelete}
      addNewRung={addNewRung}
      loading={props.loading}
      cursor={cursor}
      moveKey={moveKey}
    />
  );
}
