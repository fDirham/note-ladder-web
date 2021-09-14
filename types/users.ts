import { ladder } from "./rungs";

export type user = {
  displayName: string;
  email: string;
  uid: string;
  ladders?: ladder[]; // Full of ladder names
};
