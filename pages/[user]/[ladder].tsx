import { useRouter } from "next/dist/client/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/LadderPage.module.scss";
import PageWrapper from "components/PageWrapper";
import RungList from "components/RungList";
import { rung } from "types/rungs";
import RungController from "controllers/RungController";
import EditableLadderTitle from "components/EditableLadderTitle";

export default function UserPage() {
  const router = useRouter();
  const { user: currentDisplayName, ladder: currentLadderId } = router.query;

  const [rungList, setRungList] = useState<rung[]>();
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
    getCurrentLadder();
  }, [currentDisplayName, currentLadderId]);

  async function getCurrentLadder() {
    if (!currentDisplayName || !currentLadderId) return;
    if (parentRung) {
      if (parentRung.id === currentLadderId) return;
    }
    setLoading(true);
    const retrievedLadder = await RungController.getLadder(
      currentDisplayName as string,
      currentLadderId as string
    );

    if (_notMounted.current) return;

    if (!retrievedLadder) return handleNotFound();

    const newRungList = retrievedLadder.children || [];
    retrievedLadder.children = undefined;
    const newParentRung = retrievedLadder;
    setParentRung(newParentRung);
    setRungList(newRungList);
    if (notFound) setNotFound(false);
    setLoading(false);
  }

  function handleNotFound() {
    return setNotFound(true);
  }

  function goToUser() {
    router.push(`/${currentDisplayName}`);
  }

  async function handleChangeName(newTitle: string) {}
  if (notFound) return <div>Ladder not found</div>;

  return (
    <PageWrapper loading={loading}>
      {rungList && (
        <>
          <p className={styles.textParent}>
            {parentRung.parentRung && parentRung.parentRung.content}
          </p>
          <EditableLadderTitle
            onSubmit={handleChangeName}
            title={parentRung.content}
          />
          <div className={styles.containerSpace}>
            <p className={styles.textAuthor} onClick={goToUser}>
              By: {currentDisplayName}
            </p>
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
