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
  addNewRung: (order: number) => void;
};

export default function RungsListView(props: RungListViewProps) {
  return (
    <div className={styles.container}>
      {!props.rungs.length && (
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
