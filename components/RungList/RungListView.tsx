import React from "react";
import { rung } from "types/rungs";
import RungBlock from "./RungBlock";
import styles from "./RungListView.module.scss";
import RungSpacer from "./RungSpacer";

type RungListViewProps = {
  rungs: rung[];
  setDroppedSpacer: (prevNumber: number) => void;
  setMovingRungId: (movingId: string) => void;
  onRungClick: (rung: rung) => void;
  onRungEdit: (editedRung: rung) => void;
  onRungDelete: (rungId: string) => void;
  addNewRung: (order: number) => void;
  editingRungId: string;
  loading: boolean;
};

export default function RungsListView(props: RungListViewProps) {
  return (
    <div className={styles.container}>
      {!props.loading && !props.rungs.length && (
        <div className={styles.textEmpty}>Empty list</div>
      )}
      {props.rungs.map((rung, index) => {
        return (
          <div key={`rung-${index}`} className={styles.containerRung}>
            {index === 0 && (
              <RungSpacer
                key={"spacer-genesis-" + index}
                prevRung={-1}
                setDroppedSpacer={props.setDroppedSpacer}
                addNewRung={props.addNewRung}
              />
            )}
            <RungBlock
              key={rung.id}
              rung={rung}
              setMovingRungId={props.setMovingRungId}
              onClick={props.onRungClick}
              onEdit={props.onRungEdit}
              onDelete={props.onRungDelete}
              editing={rung.id === props.editingRungId}
            />
            <RungSpacer
              key={`spacer-${index}`}
              prevRung={index}
              setDroppedSpacer={props.setDroppedSpacer}
              addNewRung={props.addNewRung}
            />
          </div>
        );
      })}
    </div>
  );
}
