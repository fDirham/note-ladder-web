import React from "react"
import styles from "./LoadingOverlay.module.scss"

type LoadingOverlayProps = {
  enabled: boolean
}

export default function LoadingOverlay(props: LoadingOverlayProps) {
  if (props.enabled) return <div className={styles.overlay}></div>
  return null
}
