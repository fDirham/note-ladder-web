import { authStateType, useAuthState } from "globalStates/useAuthStore"
import useKeyboardControls from "hooks/useKeyboardControls"
import { useRouter } from "next/dist/client/router"
import React, { useEffect, useState } from "react"
import { rung } from "types/rungs"
import { isPropertyAccessExpression } from "typescript"
import { tempRungName } from "utilities/constants"
import RungBlock from "./RungBlock"
import styles from "./RungsList.module.scss"
import RungSpacer from "./RungSpacer"

type RungsListProps = {
  rungs: rung[]
  updateRungs: (newRungs: rung[]) => void
  deleteRung: (rungId: string) => Promise<boolean>
  addNewRung: (order: number) => void
  saveNewRung: (newRung: rung) => Promise<rung | null>
  onRungClick: (rung: rung) => void
  editingRungId: string
  setEditingRungId: (newId: string) => void
  rungValidator: (rung: rung) => boolean
  onRungMove: (rung: rung) => Promise<void>
  onEdit: (newRung: rung) => Promise<void>
  cursor: number
  incrementCursor: (incrementBy: number) => void
  loading: boolean
  author: string
}

export default function RungsList(props: RungsListProps) {
  const [movingRungId, _setMovingRungId] = useState<string>() // Id of moving rung
  const [droppedSpacer, setDroppedSpacer] = useState<number>() // prevOrder
  const [addCursorMovement, setAddCursorMovement] =
    useState<{ origin: number; newOrder: number }>()
  const router = useRouter()
  const authState: authStateType = useAuthState()

  useEffect(() => {
    if (!props.loading && props.rungs && !props.rungs.length) {
      addNewRung(0)
    }
  }, [props.rungs, props.loading])

  useEffect(() => {
    if (movingRungId && typeof droppedSpacer === "number") handleMove()
  }, [droppedSpacer, movingRungId])

  const { cursor, incrementCursor } = props
  const { moveKey } = useKeyboardControls(
    cursor,
    incrementCursor,
    !!props.editingRungId,
    props.loading,
    props.rungs,
    {
      enterRung: props.onRungClick,
      editRung: setEditRung,
      cancelEdit: cancelEdit,
      goBack: goBack,
      addNewRung: addNewRung,
      deleteRung: handleDelete,
      setMovingRungId: setMovingRungId,
      setDroppedSpacer: setDroppedSpacer,
    }
  )

  function setMovingRungId(rungId: string) {
    _setMovingRungId(rungId)
    if (!rungId) return
    const rungIndex = props.rungs.findIndex((e) => e.id === rungId)
    const toIncrement = rungIndex - props.cursor
    props.incrementCursor(toIncrement)
  }

  function handleMove() {
    if (!isUser()) return
    const newRungs = [...props.rungs]
    const rungIndex = newRungs.findIndex((e) => e.id === movingRungId)
    const rungToMove = newRungs[rungIndex]
    const oldOrder = rungIndex
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

    const actualNewOrder = newRungs.findIndex((e) => e.id === rungToMove.id)

    // Reset stuff
    setMovingRungId(undefined)
    setDroppedSpacer(undefined)

    //Call parent functions
    rungToMove.order = actualNewOrder
    props.onRungMove(rungToMove)
    props.updateRungs(newRungs)

    const toIncrement = actualNewOrder - props.cursor
    props.incrementCursor(toIncrement)
  }

  async function handleEdit(newRung: rung) {
    if (!isUser()) return
    const newRungs = [...props.rungs]
    const originalNewId = newRung.id
    if (newRung.new) {
      newRung.new = undefined
      const createdRung = await props.saveNewRung(newRung)
      if (!createdRung) {
        return handleDelete(originalNewId)
      } else newRung.id = createdRung.id
    }
    await props.onEdit(newRung)
    const rungIndex = newRungs.findIndex((e) => e.id === originalNewId)
    newRungs.splice(rungIndex, 1, newRung)
    props.updateRungs(newRungs)

    if (addCursorMovement) setAddCursorMovement(undefined)
  }

  function handleDelete(rungId: string) {
    if (!isUser()) return
    const newRungs = [...props.rungs]
    const rungIndex = newRungs.findIndex((e) => e.id === rungId)
    const rungToDelete = newRungs[rungIndex]

    if (!rungToDelete.new) props.deleteRung(rungId)
    if (!!props.editingRungId) props.setEditingRungId(undefined)

    newRungs.splice(rungIndex, 1)
    props.updateRungs(newRungs)

    let toIncrement = -1
    if (
      addCursorMovement &&
      addCursorMovement.newOrder === rungToDelete.order
    ) {
      toIncrement = addCursorMovement.origin - addCursorMovement.newOrder
      setAddCursorMovement(undefined)
    }
    if (cursor === 0) toIncrement = 0
    incrementCursor(toIncrement)
    if (!newRungs.length) goBack()
  }

  function addNewRung(order: number) {
    if (!isUser()) return
    setAddCursorMovement({ origin: cursor, newOrder: order })
    const toIncrement = order - cursor
    incrementCursor(toIncrement)
    props.addNewRung(order)
  }

  function onRungClick(rung: rung) {
    if (!isUser()) return
    const rungIndex = props.rungs.findIndex((e) => e.id === rung.id)
    const toIncrement = rungIndex - props.cursor
    props.incrementCursor(toIncrement)
    props.onRungClick(rung)
  }

  function setEditRung(rung: rung) {
    if (!isUser()) return
    props.setEditingRungId(rung.id)
  }

  function cancelEdit() {
    if (!isUser()) return
    const newRungs = [...props.rungs]
    const rungToStopEdit = newRungs[cursor]
    if (rungToStopEdit.new) handleDelete(rungToStopEdit.id)
    props.setEditingRungId(undefined)
  }

  function goBack() {
    router.push("/" + router.query.user)
  }

  function isUser() {
    if (!authState.uid) return false
    return props.author === authState.uid
  }

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
              moveKey={moveKey}
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
