import AuthController from "controllers/AuthController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { FormEvent, useEffect, useState } from "react";
import { validateEmail } from "utilities/validation";
import styles from "./LaddersList.module.scss";

type LaddersListProps = {
  ladders: string[];
};

export default function LaddersList(props: LaddersListProps) {
  return (
    <div className={styles.container}>
      {props.ladders.map((ladder) => {
        return <div>{ladder}</div>;
      })}
    </div>
  );
}
