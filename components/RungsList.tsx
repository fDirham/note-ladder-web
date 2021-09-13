import AuthController from "controllers/AuthController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, useEffect, useState } from "react";
import { ladder, rung } from "types/ladders";
import { tempRungName } from "utilities/constants";
import RungBlock from "./RungBlock";
import styles from "./RungsList.module.scss";
import RungSpacer from "./RungSpacer";

type RungsListProps = {
  rungs: rung[];
  updateRungs?: (newRungs: rung[]) => void;
  addNewRung?: (order: number) => void;
  onRungClick?: (rung: rung) => void;
};

export default function RungsList(props: RungsListProps) {
  const [movingRung, setMovingRung] = useState<string>(); // Id of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>(); // prevOrder
  const [editing, setEditing] = useState<string>(); // Id of editing rung

  useEffect(() => {
    if (movingRung && typeof droppedSpacer === "number") handleMove();
  }, [droppedSpacer, movingRung]);

  function handleMove() {
    const newRungs = [...props.rungs];
    const rungIndex = newRungs.findIndex((e) => e.id === movingRung);
    const rungToMove = newRungs[rungIndex];

    // Replace moving rung with unique temp rung
    const tempRung: rung = {
      order: rungToMove.order,
      content: tempRungName + Math.random(),
      id: "new-rung",
    };
    newRungs.splice(rungIndex, 1, tempRung);
    // Add rung in place
    newRungs.splice(droppedSpacer + 1, 0, rungToMove);
    // Delete tempRung
    newRungs.splice(
      newRungs.findIndex((e) => e.id === tempRung.id),
      1
    );
    setMovingRung(undefined);
    setDroppedSpacer(undefined);
    props.updateRungs(newRungs);
  }

  return (
    <div className={styles.container}>
      {props.rungs.map((rung, index) => {
        return (
          <div key={`rung-${index}`}>
            {index === 0 && (
              <RungSpacer
                key={"spacer-genesis-" + index}
                prevRung={-1}
                setDroppedSpacer={setDroppedSpacer}
                addNewRung={props.addNewRung}
              />
            )}
            <RungBlock
              key={rung.id}
              rung={rung}
              setMovingRung={setMovingRung}
              editing={editing === rung.id}
              setEditing={setEditing}
            />
            <RungSpacer
              key={`spacer-${index}`}
              prevRung={index}
              setDroppedSpacer={setDroppedSpacer}
              addNewRung={props.addNewRung}
            />
          </div>
        );
      })}
    </div>
  );
}
