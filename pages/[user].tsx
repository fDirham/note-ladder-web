import AuthController from "controllers/AuthController";
import UserController from "controllers/UserController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { user } from "types/users";
import styles from "styles/User.module.scss";
import RungsList from "components/RungsList";
import { ladder } from "types/ladders";
import LaddersList from "components/LaddersList";

const dummyLadders: ladder[] = [
  { name: "ladder1", order: 0, id: "test0" },
  { name: "sometext", order: 1, id: "test1" },
  { name: "lol wtf HUH", order: 2, id: "test2" },
  { name: "HAHAHAHAH", order: 3, id: "test3" },
];

export default function UserPage() {
  const router = useRouter();
  const authState: authStateType = useAuthState();
  const { user: currentDisplayName } = router.query;
  const dummyUser: user = {
    displayName: currentDisplayName as string,
    uid: "",
    email: "",
    ladders: dummyLadders,
  };
  const [currentUser, setCurrentUser] = useState<user>(dummyUser);

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

  function addNewLadder(order: number) {
    const newLadders = [...currentUser.ladders];
    const newLadder: ladder = {
      order,
      name: "new",
      id: "new-ladder",
    };
    newLadders.splice(order, 0, newLadder);
    updateUserLadders(newLadders);
  }

  function isUser() {
    if (!currentUser || !authState.uid) return false;
    return currentUser.uid === authState.uid;
  }

  function updateUserLadders(newLadders: ladder[]) {
    const newUser = { ...currentUser };
    newUser.ladders = newLadders;
    setCurrentUser(newUser);
  }

  if (!currentUser) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <h1>{currentDisplayName}</h1>
      {isUser() && <button onClick={logOut}>Logout</button>}
      {isUser() && <button onClick={() => addNewLadder(0)}>New ladder</button>}
      <LaddersList
        ladders={currentUser.ladders || []}
        updateLadders={updateUserLadders}
        addNewLadder={addNewLadder}
        onLadderClick={console.log}
      />
    </div>
  );
}
