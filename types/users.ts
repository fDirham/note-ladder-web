import { rung } from "./rungs";

export type user = {
  displayName: string;
  email: string;
  uid: string;
  countLadders: number;
  ladders?: rung[]; // Full of ladder names
};
