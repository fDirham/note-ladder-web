import { authStateType, useAuthState } from "globalStates/useAuthStore";
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

  const rungActions = useRungActions(
    props.parentRung,
    props.setParentRung,
    props.rungList,
    props.setRungList
  );

  useEffect(() => {
    if (!props.loading && props.rungList && !props.rungList.length) {
      addNewRung(0);
    }
  }, [props.rungList, props.loading]);

  useEffect(() => {
    if (movingRungId && typeof droppedSpacer === "number") handleMove();
  }, [droppedSpacer, movingRungId]);

  async function addNewRung(order: number) {
    await rungActions.createNewRung(order);
  }

  async function handleMove() {
    await rungActions.reorderRung(movingRungId, droppedSpacer);
    setMovingRungId(undefined);
    setDroppedSpacer(undefined);
  }

  function handleRungClick(rung: rung) {
    console.log("clicked on rung", rung);
  }

  return (
    <RungsListView
      rungs={props.rungList}
      setDroppedSpacer={setDroppedSpacer}
      setMovingRungId={setMovingRungId}
      onRungClick={handleRungClick}
      addNewRung={addNewRung}
    />
  );
}
