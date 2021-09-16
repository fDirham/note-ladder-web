import LadderController from "controllers/LadderController";
import React, { useEffect } from "react";
import {
  ladder,
  laddersToRungs,
  ladderToRung,
  rung,
  rungsToLadders,
  rungToLadder,
} from "types/rungs";
import RungsList from "./RungsList";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import { validateAlphanumeric } from "utilities/validation";
import { maxLadderNameLength } from "utilities/constants";

type LaddersListProps = {
  ladders: ladder[];
  updateLadders?: (newLadders: ladder[]) => void;
  addNewLadder?: (order: number) => void;
  editingLadderId: string;
  setEditingLadderId: (newId: string) => void;
};

export default function LaddersList(props: LaddersListProps) {
  const router = useRouter();
  const authState: authStateType = useAuthState();
  useEffect(() => {}, [props.ladders]);

  function updateRungs(newRungs: rung[]) {
    props.updateLadders(rungsToLadders(newRungs));
  }

  function addNewRung(order: number) {
    props.addNewLadder(order);
  }

  function handleRungClick(rung: rung) {
    router.push(`/${router.query.user}/${rung.id}`);
  }

  function rungValidator(rung: rung) {
    return rung.content.length <= maxLadderNameLength;
  }

  async function saveNewRung(newRung: rung) {
    const newLadder = rungToLadder(newRung);
    try {
      const accessToken = await authState.getAccessToken();
      const createdLadder = await LadderController.createLadder(
        newLadder.name,
        newLadder.order,
        accessToken
      );
      if (!createdLadder) return null;
      return ladderToRung(createdLadder);
    } catch (error) {
      return null;
    }
  }

  async function handleEdit(newRung: rung) {
    const accessToken = await authState.getAccessToken();
    await LadderController.editLadder(newRung.id, newRung.content, accessToken);
  }

  async function handleRungMove(rung: rung) {
    const accessToken = await authState.getAccessToken();
    await LadderController.reorderLadder(rung.id, rung.order, accessToken);
  }

  return (
    <RungsList
      rungs={laddersToRungs(props.ladders)}
      updateRungs={updateRungs}
      addNewRung={addNewRung}
      saveNewRung={saveNewRung}
      onRungClick={handleRungClick}
      editingRungId={props.editingLadderId}
      setEditingRungId={props.setEditingLadderId}
      rungValidator={rungValidator}
      onRungMove={handleRungMove}
      onEdit={handleEdit}
    />
  );
}
