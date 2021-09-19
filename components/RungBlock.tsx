import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react"
import { useDrag } from "react-dnd"
import { itemTypes } from "types/dnd"
import { rung } from "types/rungs"
import styles from "./RungBlock.module.scss"

type RungBlockProps = {
  rung: rung
  setMovingRungId: (rungId: string) => void
  editing: boolean
  setEditingRungId: (rungId: string) => void
  onEdit?: (newRung: rung) => void
  onClick?: (rung: rung) => void
  onDelete?: (rungId: string) => void
  rungValidator: (rung: rung) => boolean
  selected: boolean
}

export default function RungBlock(props: RungBlockProps) {
  const [stateContent, setStateContent] = useState<string>(props.rung.content)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.LADDER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  useEffect(() => {
    if (!props.editing && !stateContent) props.onDelete(props.rung.id)
  }, [props.editing])

  useEffect(() => {
    const toSet = isDragging ? props.rung.id : undefined
    props.setMovingRungId(toSet)
  }, [isDragging])

  async function handleSubmit(e: FormEvent) {
    if (e) e.preventDefault()
    if (!stateContent) return props.onDelete(props.rung.id)
    const newRung = { ...props.rung }
    newRung.content = stateContent
    props.onEdit(newRung)
    stopEditing()
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    const newRung = { ...props.rung }
    newRung.content = value
    if (!props.rungValidator(newRung)) return
    setStateContent(value)
  }

  function stopEditing() {
    props.setEditingRungId(undefined)
  }

  return (
    <div
      ref={drag}
      className={`
      ${styles.container}
      ${isDragging ? styles.containerIsDragging : ""}
      ${props.rung.new ? styles.containerNew : ""}
      ${props.selected ? styles.containerSelected : ""}
      `}
      onBlur={handleSubmit}
      onClick={() => props.onClick(props.rung)}
    >
      {!props.editing ? (
        stateContent
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={stateContent}
            onChange={handleChange}
          />
        </form>
      )}
    </div>
  )
}
