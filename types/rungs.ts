export type rung = {
  id: string;
  alias: number;
  content: string;
  parent: string;
  order: number;
  countChildren: number;
  author: string;
  new?: boolean;
};
