import AuthController from "controllers/AuthController"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { useRouter } from "next/dist/client/router"
import React, { FormEvent, useEffect, useState } from "react"
import { validateEmail } from "utilities/validation"
import styles from "./SignIn.module.scss"

type SignInProps = {
  onSignUp: () => void
  setLoading: (newLoading: boolean) => void
}

export default function SignIn(props: SignInProps) {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const authState: authStateType = useAuthState()

  async function handleSubmit(e: FormEvent | undefined) {
    setError("")
    if (e) e.preventDefault()
    if (!email || !validateEmail(email)) return setError("Invalid email")
    if (!password) return setError("Input password")

    props.setLoading(true)
    const user = await AuthController.logIn(email, password)

    if (!user.uid) setError("Invalid credentials")
    else authState.setState(user)
    props.setLoading(false)
  }

  return (
    <div className={styles.container}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          placeholder={"email"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          placeholder={"password"}
          type={"password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={"submit"}>Sign in</button>
        <p className={styles.textOther} onClick={props.onSignUp}>
          Sign up
        </p>
        <p className={styles.textError}>{error}</p>
      </form>
    </div>
  )
}
