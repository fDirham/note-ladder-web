import { firebaseAuth } from "firebaseApp";

export async function getAccessToken() {
  const newToken = await firebaseAuth.currentUser.getIdToken(true);
  return newToken;
}
