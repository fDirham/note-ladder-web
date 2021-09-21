import React from "react"
import LoadingOverlay from "./LoadingOverlay"
import styles from "./PageWrapper.module.scss"

type PageWrapperProps = {
  children: any
  loading: boolean
}

export default function PageWrapper({ children, loading }: PageWrapperProps) {
  return (
    <div
      className={`${styles.container} ${
        loading ? styles.loadingContainer : ""
      }`}
    >
      <LoadingOverlay enabled={loading} />
      <div className={styles.innerContainer}>{children}</div>
    </div>
  )
}
