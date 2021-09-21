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
  const authState: authStateType = useAuthState()
  const router = useRouter()

  useEffect(() => {
    // Check localStorage, log user in
    if (authState.uid) router.push(`/${authState.displayName}`)
  }, [authState.uid])

  return (
    <div className={styles.container}>
      <Head>
        <title>Note Ladder</title>
        <meta name="description" content="FBD's note taking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PageWrapper loading={false}>
          <h1 className={styles.title}>Note Ladder</h1>

          <div>
            {signUp ? (
              <SignUp onSignIn={() => setSignUp(false)} />
            ) : (
              <SignIn onSignUp={() => setSignUp(true)} />
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
