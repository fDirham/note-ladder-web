import AuthController from "controllers/AuthController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { itemTypes } from "types/dnd";
import styles from "./RungSpacer.module.scss";

type RungSpacerProps = {
  prevRung: number;
  setDroppedSpacer: (prevNumber: number) => void;
};

export default function RungSpacer(props: RungSpacerProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: itemTypes.LADDER,
      drop: () => handleDrop(),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  function handleDrop() {
    props.setDroppedSpacer(props.prevRung);
  }

  return (
    <div
      ref={drop}
      className={styles.container}
      style={{ backgroundColor: isOver ? "red" : "blue" }}
    ></div>
  );
}
