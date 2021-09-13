import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { itemTypes } from "types/dnd";
import { rung } from "types/ladders";
import styles from "./RungBlock.module.scss";

type RungBlockProps = {
  rung: rung;
  setMovingRung: (rungId: string) => void;
  editing: boolean;
  setEditing: (rungId: string) => void;
  onEdit?: (newRung: rung) => void;
  onClick?: (rung: string) => void;
};

export default function RungBlock(props: RungBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.LADDER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    props.setMovingRung(props.rung.id);
  }, [isDragging]);

  return (
    <div
      ref={drag}
      className={`${styles.container} ${
        isDragging ? styles.containerIsDragging : ""
      }`}
    >
      {props.rung.content}
    </div>
  );
}
