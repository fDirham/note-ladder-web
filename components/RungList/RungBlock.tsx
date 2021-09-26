import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDrag } from "react-dnd"
import { itemTypes } from "types/dnd"
import { rung } from "types/rungs"
import styles from "./RungBlock.module.scss"

type RungBlockProps = {
  rung: rung
  setMovingRungId: (rungId: string) => void
  onClick?: (rung: rung) => void
}

export default function RungBlock(props: RungBlockProps) {
  const [stateContent, setStateContent] = useState<string>(props.rung.content)
  const inputRef = useRef(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.LADDER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))


  useEffect(() => {
    const toSet = isDragging ? props.rung.id : undefined
    props.setMovingRungId(toSet)
  }, [isDragging])


  function scrollToBlock() {
    const windowHeight = window.innerHeight
    const boundingClientRectTop = inputRef.current.getBoundingClientRect().top
    const yOffset = 150
    const needScroll =
      boundingClientRectTop > windowHeight - yOffset ||
      boundingClientRectTop < yOffset

    if (!needScroll) return

    const y = boundingClientRectTop + window.pageYOffset - yOffset
    window.scrollTo({ top: y, behavior: "smooth" })
  }

  async function handleSubmit(e: FormEvent) {
    if (e) e.preventDefault()
  }

  function validateRung(rung: rung){
    return true
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    const newRung = { ...props.rung }
    newRung.content = value
    if (!validateRung(newRung)) return
    setStateContent(value)
  }


      // ${props.selected ? styles.selectedContainer : ""}
      // ${props.moveKey && props.selected ? styles.draggingContainer : ""}
  return (
    <div
      ref={drag}
      className={`
      ${styles.container}
      ${isDragging ? styles.draggingContainer : ""}
      ${props.rung.new ? styles.newContainer : ""}
      `}
      onBlur={handleSubmit}
      onClick={() => props.onClick(props.rung)}
    >
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={stateContent}
          onChange={handleChange}
          disabled={true}
        />
      </form>
    </div>
  )
}
