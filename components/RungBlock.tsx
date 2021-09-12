import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { itemTypes } from "types/dnd";
import styles from "./RungBlock.module.scss";

type RungBlockProps = {
  rung: string;
  setMovingRung: (rung: string) => void;
};

export default function RungBlock(props: RungBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.LADDER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    props.setMovingRung(props.rung);
  }, [isDragging]);

  return (
    <div
      ref={drag}
      className={`${styles.container} ${
        isDragging ? styles.containerIsDragging : ""
      }`}
    >
      {props.rung}
    </div>
  );
}
