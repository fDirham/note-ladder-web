import AuthController from "controllers/AuthController";
import UserController from "controllers/UserController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { user } from "types/users";
import styles from "styles/User.module.scss";
import RungsList from "components/RungsList";

const dummyLadders = ["ladder1", "some text", "wtf man", "HAHAHAHHA"];
export default function UserPage() {
  const router = useRouter();
  const authState: authStateType = useAuthState();
  const { user: currentDisplayName } = router.query;
  const [currentUser, setCurrentUser] = useState<user>({
    displayName: currentDisplayName as string,
    uid: "",
    email: "",
    ladders: dummyLadders,
  });

  useEffect(() => {
    getCurrentUser();
  }, [currentDisplayName]);

  async function getCurrentUser() {
    if (!currentDisplayName || currentUser) return;
    const retrievedUser = await UserController.getUser(
      currentDisplayName as string
    );
    if (!retrievedUser) return handleNotFound();
    console.log(retrievedUser);
    setCurrentUser(retrievedUser);
  }

  function handleNotFound() {
    window.alert("User not found");
    router.push("/");
  }

  async function logOut() {
    const logOutSuccess = await AuthController.logOut(authState.accessToken);
    if (!logOutSuccess)
      return window.alert("Error logging out, try again later");
    authState.resetState();
    router.push("/");
  }

  function isUser() {
    if (!currentUser || !authState.uid) return false;
    return currentUser.uid === authState.uid;
  }

  function updateUserLadder(newLadders: string[]) {
    const newUser = { ...currentUser };
    newUser.ladders = newLadders;
    setCurrentUser(newUser);
  }

  if (!currentUser) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <h1>{currentDisplayName}</h1>
      {isUser() && <button onClick={logOut}>Logout</button>}
      <RungsList
        ladders={currentUser.ladders || []}
        updateLadders={updateUserLadder}
      />
    </div>
  );
}
