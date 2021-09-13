import React from "react";
import {
  ladder,
  laddersToRungs,
  note,
  rung,
  rungsToLadders,
  rungToLadder,
} from "types/ladders";
import RungsList from "./RungsList";

type LaddersListProps = {
  ladders: ladder[];
  updateLadders?: (newLadders: ladder[]) => void;
  addNewLadder?: (order: number) => void;
  onLadderClick?: (ladder: ladder) => void;
};

export default function LaddersList(props: LaddersListProps) {
  function updateRungs(newRungs: rung[]) {
    props.updateLadders(rungsToLadders(newRungs));
  }

  function addNewRung(order: number) {
    props.addNewLadder(order);
  }

  function onRungClick(rung: rung) {
    props.onLadderClick(rungToLadder(rung));
  }

  return (
    // <div></div>
    <RungsList
      rungs={laddersToRungs(props.ladders)}
      updateRungs={updateRungs}
      addNewRung={addNewRung}
      onRungClick={onRungClick}
    />
  );
}
