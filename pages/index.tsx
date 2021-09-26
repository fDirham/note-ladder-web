import PageWrapper from "components/PageWrapper"
import SignIn from "components/SignIn"
import SignUp from "components/SignUp"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import AuthController from "../controllers/AuthController"
import styles from "../styles/Home.module.scss"

export default function Home() {
  const [signUp, setSignUp] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const authState: authStateType = useAuthState()
  const router = useRouter()

  useEffect(() => {
    // Check localStorage, log user in
    if (authState.uid) router.push(`/${authState.displayName}`)
  }, [authState.uid])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <PageWrapper loading={loading}>
          <h1 className={styles.title}>Note Ladder</h1>

          <div>
            {signUp ? (
              <SignUp onSignIn={() => setSignUp(false)} setLoading={setLoading} />
            ) : (
              <SignIn onSignUp={() => setSignUp(true)} setLoading={setLoading} />
            )}
          </div>
        </PageWrapper>
      </main>

      <footer className={styles.footer}>
        <p>
          created by <span style={{ fontWeight: "bold" }}>FBD</span>
        </p>
      </footer>
    </div>
  )
}
