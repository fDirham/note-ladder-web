import AuthController from "controllers/AuthController";
import UserController from "controllers/UserController";
import { authStateType, useAuthState } from "globalStates/useAuthStore";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/LadderPage.module.scss";
import { user } from "types/users";
import PageWrapper from "components/PageWrapper";
import RungList from "components/RungList";
import { rung } from "types/rungs";

export default function UserPage() {
  const router = useRouter();
  const { user: currentDisplayName } = router.query;
  const authState: authStateType = useAuthState();

  const [currentUser, setCurrentUser] = useState<user>();
  const [rungList, setRungList] = useState<rung[]>([]);
  const [parentRung, setParentRung] = useState<rung>();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const _notMounted = useRef(false);

  useEffect(() => {
    return () => {
      _notMounted.current = true;
    };
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [currentDisplayName]);

  async function getCurrentUser() {
    if (
      !currentDisplayName ||
      (currentUser && currentUser.displayName === currentDisplayName)
    )
      return;

    const retrievedUser = await UserController.getUser(
      currentDisplayName as string
    );

    if (_notMounted.current) return;

    if (!retrievedUser) return handleNotFound();
    const newRungList = retrievedUser.ladders;
    retrievedUser.ladders = undefined;
    const newParentRung: rung = {
      id: "",
      alias: 0,
      content: "",
      parent: "",
      order: 0,
      countChildren: retrievedUser.countLadders,
      trueCountChildren: retrievedUser.trueCountLadders,
      author: retrievedUser.uid,
    };
    setParentRung(newParentRung);
    setRungList(newRungList);
    setCurrentUser(retrievedUser);
    if (notFound) setNotFound(false);
    setLoading(false);
  }

  function handleNotFound() {
    return setNotFound(true);
  }

  async function logOut() {
    const accessToken = await authState.getAccessToken();
    const logOutSuccess = await AuthController.logOut(accessToken);
    if (!logOutSuccess)
      return window.alert("Error logging out, try again later");
    authState.resetState();
    router.push("/");
  }

  function isUser() {
    if (!currentUser || !authState.uid) return false;
    return currentUser.uid === authState.uid;
  }

  if (notFound) return <div>User not found</div>;

  return (
    <PageWrapper loading={loading}>
      <p className={styles.textParent}>NoteLadder by</p>
      <h1>{currentDisplayName}</h1>
      {currentUser && (
        <>
          <div className={styles.containerSpace}>
            {isUser() && (
              <>
                <button onClick={logOut}>Logout</button>
              </>
            )}
          </div>
          <RungList
            parentRung={parentRung}
            setParentRung={setParentRung}
            rungList={rungList}
            setRungList={setRungList}
            loading={loading}
          />
        </>
      )}
    </PageWrapper>
  );
}
