import useKeyboardControls, {
  keyboardFunctions,
} from "hooks/useKeyboardControls"
import useKeyHold from "hooks/useKeyHold"
import useKeyTap from "hooks/useKeyTap"
import useRungCursor from "hooks/useRungCursor"
import { useRouter } from "next/dist/client/router"
import React, { useEffect, useRef, useState } from "react"
import { rung } from "types/rungs"
import { tempRungName } from "utilities/constants"
import RungBlock from "./RungBlock"
import styles from "./RungsList.module.scss"
import RungSpacer from "./RungSpacer"

type RungsListProps = {
  rungs: rung[]
  updateRungs: (newRungs: rung[]) => void
  addNewRung: (order: number) => void
  saveNewRung: (newRung: rung) => Promise<rung | null>
  onRungClick: (rung: rung) => void
  editingRungId: string
  setEditingRungId: (newId: string) => void
  rungValidator: (rung: rung) => boolean
  onRungMove: (rung: rung) => Promise<void>
  onEdit: (newRung: rung) => Promise<void>
}

export default function RungsList(props: RungsListProps) {
  const [movingRungId, setMovingRungId] = useState<string>() // Id of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>() // prevOrder
  const router = useRouter()

  useEffect(() => {
    if (movingRungId && typeof droppedSpacer === "number") handleMove()
  }, [droppedSpacer, movingRungId])

  const { cursor, incrementCursor } = useRungCursor(
    props.rungs.length,
    !!props.editingRungId
  )
  useKeyboardControls(
    cursor,
    incrementCursor,
    props.rungs,
    !!props.editingRungId,
    {
      enterRung: props.onRungClick,
      editRung: setEditRung,
      cancelEdit: cancelEdit,
      goBack: goBack,
      addNewRung: addNewRung,
    }
  )

  function handleMove() {
    const newRungs = [...props.rungs]
    const rungIndex = newRungs.findIndex((e) => e.id === movingRungId)
    const rungToMove = newRungs[rungIndex]
    const oldOrder = rungToMove.order
    const newOrder = droppedSpacer + 1
    if (oldOrder === newOrder) return

    // Replace moving rung with unique temp rung
    const tempRung: rung = {
      order: rungToMove.order,
      content: tempRungName + Math.random(),
      id: "new-rung-" + Math.random(),
      author: rungToMove.author,
    }
    newRungs.splice(rungIndex, 1, tempRung)

    // Add rung in place
    newRungs.splice(newOrder, 0, rungToMove)

    // Delete tempRung
    newRungs.splice(
      newRungs.findIndex((e) => e.id === tempRung.id),
      1
    )

    // Reset stuff
    setMovingRungId(undefined)
    setDroppedSpacer(undefined)

    //Call parent functions
    rungToMove.order = newOrder
    props.onRungMove(rungToMove)
    props.updateRungs(newRungs)
  }

  async function handleEdit(newRung: rung) {
    const newRungs = [...props.rungs]
    const originalNewId = newRung.id
    if (newRung.new) {
      newRung.new = undefined
      const createdRung = await props.saveNewRung(newRung)
      if (!createdRung) {
        return handleDelete(originalNewId)
      } else newRung.id = createdRung.id
    }
    const rungIndex = newRungs.findIndex((e) => e.id === originalNewId)
    newRungs.splice(rungIndex, 1, newRung)
    props.updateRungs(newRungs)

    if (!newRung.new) props.onEdit(newRung)
  }

  function handleDelete(rungId: string) {
    const newRungs = [...props.rungs]
    const rungIndex = newRungs.findIndex((e) => e.id === rungId)
    if (rungIndex <= cursor) incrementCursor(-1)
    newRungs.splice(rungIndex, 1)
    props.updateRungs(newRungs)
  }

  function addNewRung(order: number) {
    if (order <= cursor) incrementCursor(1)
    props.addNewRung(order)
  }

  function onRungClick(rung: rung) {
    props.onRungClick(rung)
  }

  function setEditRung(rung: rung) {
    props.setEditingRungId(rung.id)
  }

  function cancelEdit() {
    props.setEditingRungId(undefined)
  }

  function goBack() {
    router.back()
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
                addNewRung={addNewRung}
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
              onClick={onRungClick}
              selected={index === cursor}
            />
            <RungSpacer
              key={`spacer-${index}`}
              prevRung={index}
              setDroppedSpacer={setDroppedSpacer}
              addNewRung={addNewRung}
            />
          </div>
        )
      })}
    </div>
  )
}
