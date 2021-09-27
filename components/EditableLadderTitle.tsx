import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { maxNoteContentLength } from "utilities/constants";

import styles from "./EditableLadderTitle.module.scss";

type EditableLadderTitleProps = {
  onSubmit: (newTitle: string) => Promise<void>;
  title: string;
};

export default function EditableLadderTitle(props: EditableLadderTitleProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [currentTitle, setCurrentTitle] = useState<string>(props.title);

  useEffect(() => {
    setCurrentTitle(props.title);
  }, [props.title]);

  function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!editing) return;
    if (currentTitle === props.title) return setEditing(false);
    props.onSubmit(currentTitle);
    setEditing(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value.length > maxNoteContentLength) return;
    setCurrentTitle(value);
  }
  return (
    <div
      onClick={() => {
        setEditing(true);
      }}
      className={styles.container}
    >
      {editing ? (
        <form action="" onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={currentTitle}
            onChange={handleChange}
          />
        </form>
      ) : (
        <h1>{currentTitle}</h1>
      )}
    </div>
  );
}
