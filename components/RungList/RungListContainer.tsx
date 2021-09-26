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

  const { cursor } = useCursor(props.rungList.length, false);

  const { moveKey } = useKeyboardControls(
    props.rungList,
    cursor,
    !!editingRungId,
    props.loading,
    {
      enterRung,
      setRungToEdit: setRungToEdit,
      cancelEdit: () => setEditingRungId(undefined),
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
    handleError
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
    if (newRung) return setEditingRungId(newRung.id);
    if (props.rungList.length) setEditingRungId(props.rungList[0].id);
  }

  async function handleMove() {
    await rungActions.reorderRung(movingRungId, droppedSpacer);
    setMovingRungId(undefined);
    setDroppedSpacer(undefined);
  }

  function handleRungClick(rung: rung) {
    console.log(router);
    if (!rung.new) enterRung(rung.id);
    else setRungToEdit(rung.id);
  }

  function setRungToEdit(rungId: string) {
    setMovingRungId(rungId);
  }
  function enterRung(rungId: string) {
    const { user } = router.query;
    router.push(`/${user}/${rungId}`);
  }

  async function handleRungEdit(editedRung: rung) {
    setEditingRungId(undefined);
    await rungActions.editRung(editedRung);
  }

  async function handleRungDelete(rungId: string) {
    await rungActions.deleteRung(rungId);
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
    />
  );
}
