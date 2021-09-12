import AuthController from "controllers/AuthController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { itemTypes } from "types/dnd";
import { isGetAccessorDeclaration } from "typescript";
import { tempRung } from "utilities/constants";
import { validateEmail } from "utilities/validation";
import RungBlock from "./RungBlock";
import styles from "./RungsList.module.scss";
import RungSpacer from "./RungSpacer";

type RungsListProps = {
  ladders: string[];
  updateLadders: (newLadders: string[]) => void;
};

export default function RungsList(props: RungsListProps) {
  const [movingRung, setMovingRung] = useState<string>(); // Order of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>(); // prevOrder

  useEffect(() => {
    if (movingRung && typeof droppedSpacer === "number") handleMove();
  }, [droppedSpacer, movingRung]);

  function handleMove() {
    const newLadders = [...props.ladders];
    console.log(newLadders);
    const rungIndex = newLadders.findIndex((e) => e === movingRung);
    // Replace rungToMove with unique string
    newLadders.splice(rungIndex, 1, tempRung);
    console.log(newLadders);
    // Add rung in place
    newLadders.splice(droppedSpacer + 1, 0, movingRung);
    console.log(newLadders);
    // Delete tempRung
    newLadders.splice(
      newLadders.findIndex((e) => e === tempRung),
      1
    );
    console.log(newLadders);
    setMovingRung(undefined);
    setDroppedSpacer(undefined);
    props.updateLadders(newLadders);
  }

  return (
    <div className={styles.container}>
      {props.ladders.map((rung, index) => {
        return (
          <div key={`rung-${index}`}>
            {index === 0 && (
              <RungSpacer
                key={"spacer-genesis-" + index}
                prevRung={-1}
                setDroppedSpacer={setDroppedSpacer}
              />
            )}
            <RungBlock key={rung} rung={rung} setMovingRung={setMovingRung} />
            <RungSpacer
              key={`spacer-${index}`}
              prevRung={index}
              setDroppedSpacer={setDroppedSpacer}
            />
          </div>
        );
      })}
    </div>
  );
}
