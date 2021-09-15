import React, { useEffect, useState } from "react";
import { rung } from "types/rungs";
import { tempRungName } from "utilities/constants";
import RungBlock from "./RungBlock";
import styles from "./RungsList.module.scss";
import RungSpacer from "./RungSpacer";

type RungsListProps = {
  rungs: rung[];
  updateRungs: (newRungs: rung[]) => void;
  addNewRung: (order: number) => void;
  saveNewRung: (newRung: rung) => Promise<rung | null>;
  onRungClick: (rung: rung) => void;
  editingRungId: string;
  setEditingRungId: (newId: string) => void;
  rungValidator: (rung: rung) => boolean;
  onRungMove: (rung: rung) => Promise<void>;
};

export default function RungsList(props: RungsListProps) {
  const [movingRungId, setMovingRungId] = useState<string>(); // Id of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>(); // prevOrder

  useEffect(() => {}, [props.rungs]);
  useEffect(() => {
    if (movingRungId && typeof droppedSpacer === "number") handleMove();
  }, [droppedSpacer, movingRungId]);

  function handleMove() {
    const newRungs = [...props.rungs];
    const rungIndex = newRungs.findIndex((e) => e.id === movingRungId);
    const rungToMove = newRungs[rungIndex];

    // Replace moving rung with unique temp rung
    const tempRung: rung = {
      order: rungToMove.order,
      content: tempRungName + Math.random(),
      id: "new-rung-" + Math.random(),
      author: rungToMove.author,
    };
    newRungs.splice(rungIndex, 1, tempRung);

    // Add rung in place
    newRungs.splice(droppedSpacer + 1, 0, rungToMove);

    // Delete tempRung
    newRungs.splice(
      newRungs.findIndex((e) => e.id === tempRung.id),
      1
    );

    setMovingRungId(undefined);
    setDroppedSpacer(undefined);
    props.updateRungs(newRungs);

    // Update order
    const newOrder = newRungs.findIndex((e) => e.id === movingRungId);
    rungToMove.order = newOrder;
    props.onRungMove(rungToMove);
  }

  async function handleEdit(newRung: rung) {
    const newRungs = [...props.rungs];
    const originalNewId = newRung.id;
    if (newRung.new) {
      newRung.new = undefined;
      const createdRung = await props.saveNewRung(newRung);
      if (!createdRung) {
        return handleDelete(originalNewId);
      } else newRung.id = createdRung.id;
    }
    const rungIndex = newRungs.findIndex((e) => e.id === originalNewId);
    newRungs.splice(rungIndex, 1, newRung);
    props.updateRungs(newRungs);
  }

  function handleDelete(rungId: string) {
    const newRungs = [...props.rungs];
    const rungIndex = newRungs.findIndex((e) => e.id === rungId);
    newRungs.splice(rungIndex, 1);
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
              setMovingRungId={setMovingRungId}
              editing={props.editingRungId === rung.id}
              setEditingRungId={props.setEditingRungId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              rungValidator={props.rungValidator}
              onClick={props.onRungClick}
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
