export type rung = {
  id: string;
  alias: number;
  content: string;
  parent: string;
  order: number;
  countChildren: number;
  trueCountChildren: number;
  author: string;
  new?: boolean;
  children?: rung[];
  parentRung?: rung;
};
