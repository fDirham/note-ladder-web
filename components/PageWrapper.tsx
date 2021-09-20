import React from "react"
import styles from "./PageWrapper.module.scss"

type PageWrapperProps = {
  children: any
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>{children}</div>
    </div>
  )
}
