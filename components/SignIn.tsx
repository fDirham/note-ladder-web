import AuthController from "controllers/AuthController";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "./SignIn.module.scss";

type SignInProps = {
  onSignUp: () => void;
};

export default function SignIn(props: SignInProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check localStorage, log user in
  }, []);

  async function handleSubmit(e: FormEvent | undefined) {
    if (e) e.preventDefault();
    const user = await AuthController.logIn(email, password);
    if (!user) return setError("Invalid credentials");
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
        <button type={"submit"}>Log in</button>
        <p onClick={props.onSignUp}>Don't have account? Sign up</p>
      </form>
    </div>
  );
}
