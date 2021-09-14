export type ladder = {
  name: string;
  order: number;
  id: string;
  author: string;
  new?: boolean;
};

export type rung = {
  content: string;
  order: number;
  id: string;
  author: string;
  new?: boolean;
};

export type note = {
  content: string;
  order: number;
  id: string;
  author: string;
  new?: boolean;
};

export function ladderToRung(ladder: ladder): rung {
  return {
    content: ladder.name,
    order: ladder.order,
    id: ladder.id,
    author: ladder.author,
    new: ladder.new,
  };
}

export function laddersToRungs(ladders: ladder[]): rung[] {
  const processedData: rung[] = [];

  ladders.forEach((ladder: ladder) => {
    processedData.push(ladderToRung(ladder));
  });

  return processedData;
}

export function rungToLadder(rung: rung): ladder {
  return {
    name: rung.content,
    order: rung.order,
    id: rung.id,
    author: rung.author,
    new: rung.new,
  };
}

export function rungsToLadders(rungs: rung[]): ladder[] {
  const processedData: ladder[] = [];

  rungs.forEach((rung: rung) => {
    processedData.push(rungToLadder(rung));
  });

  return processedData;
}
