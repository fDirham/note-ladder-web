import React, { FormEvent, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { itemTypes } from "types/dnd";
import { rung } from "types/ladders";
import styles from "./RungBlock.module.scss";

type RungBlockProps = {
  rung: rung;
  setMovingRungId: (rungId: string) => void;
  editing: boolean;
  setEditingRungId: (rungId: string) => void;
  onEdit?: (newRung: rung) => void;
  onClick?: (rungId: string) => void;
  onDelete?: (rungId: string) => void;
};

export default function RungBlock(props: RungBlockProps) {
  const [stateContent, setStateContent] = useState<string>(props.rung.content);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.LADDER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (!props.editing && !stateContent) props.onDelete(props.rung.id);
  }, [props.editing]);

  useEffect(() => {
    const toSet = isDragging ? props.rung.id : undefined;
    props.setMovingRungId(toSet);
  }, [isDragging]);

  async function handleChangeContent(e: FormEvent) {
    if (e) e.preventDefault();
    if (!stateContent) return props.onDelete(props.rung.id);
    const newRung = { ...props.rung };
    newRung.content = stateContent;
    props.onEdit(newRung);
    stopEditing();
  }

  function stopEditing() {
    props.setEditingRungId(undefined);
  }

  return (
    <div
      ref={drag}
      className={`${styles.container} ${
        isDragging ? styles.containerIsDragging : ""
      }`}
      onBlur={handleChangeContent}
    >
      {!props.editing ? (
        stateContent
      ) : (
        <form onSubmit={handleChangeContent}>
          <input
            autoFocus
            type="text"
            value={stateContent}
            onChange={(e) => setStateContent(e.target.value)}
          />
        </form>
      )}
      {props.rung.new && "new"}
    </div>
  );
}
