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

  function onRungClick(rung: rung) {
    router.push(`/${router.query.user}/${rung.id}`);
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

  function rungValidator(rung: rung) {
    return rung.content.length < 30;
  }

  return (
    <RungsList
      rungs={laddersToRungs(props.ladders)}
      updateRungs={updateRungs}
      addNewRung={addNewRung}
      saveNewRung={saveNewRung}
      onRungClick={onRungClick}
      editingRungId={props.editingLadderId}
      setEditingRungId={props.setEditingLadderId}
      rungValidator={rungValidator}
    />
  );
}
