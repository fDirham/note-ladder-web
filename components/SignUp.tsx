import AuthController from "controllers/AuthController"
import { authStateType, useAuthState } from "globalStates/useAuthStore"
import { useRouter } from "next/dist/client/router"
import React, { FormEvent, useEffect, useState } from "react"
import { validateEmail } from "utilities/validation"
import styles from "./SignUp.module.scss"

type SignUpProps = {
  onSignIn: () => void
}

export default function SignUp(props: SignUpProps) {
  const [email, setEmail] = useState<string>("")
  const [displayName, setDisplayName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirm, setConfirm] = useState<string>("")
  const [error, setError] = useState<string>("")

  const authState: authStateType = useAuthState()

  async function handleSubmit(e: FormEvent | undefined) {
    setError("")
    if (e) e.preventDefault()
    if (!displayName) return setError("Input display name")
    if (displayName.length > 30) return setError("Display name too long")
    if (!email || !validateEmail(email)) return setError("Invalid email")
    if (!password) return setError("Input password")
    if (password !== confirm) return setError("Password does not match confirm")
    const validateRes = await AuthController.validateCredentials(
      email,
      displayName
    )
    if (!validateRes.displayName) return setError("Display name already used")
    if (!validateRes.email) return setError("Email already used")
    const signUpRes = await AuthController.signUp(email, password, displayName)
    if (!signUpRes.user) return setError("Error signing up, try again later")
    window.alert("Success! Please sign in.")
    props.onSignIn()
  }

  return (
    <div className={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={displayName}
          placeholder={"display name"}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
        <input
          value={confirm}
          placeholder={"confirm password"}
          type={"password"}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type={"submit"}>Sign Up</button>
        <p className={styles.textOther} onClick={props.onSignIn}>
          Sign in
        </p>
        <p className={styles.textError}>{error}</p>
      </form>
    </div>
  )
}
