import AuthController from "controllers/AuthController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function UserPage() {
  const router = useRouter();
  const authState: authStateType = useAuthState();
  const { user } = router.query;

  async function logOut() {
    const logOutSuccess = await AuthController.logOut(authState.accessToken);
    if (!logOutSuccess)
      return window.alert("Error logging out, try again later");
    authState.resetState();
    router.push("/");
  }

  function isUser() {
    return !!authState.uid;
  }
  return (
    <div>
      user ONLY: {user}
      {isUser() && <button onClick={logOut}>Logout</button>}
    </div>
  );
}
