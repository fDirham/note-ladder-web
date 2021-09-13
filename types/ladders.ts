export type ladder = {
  name: string;
  order: number;
  id: string;
};

export type rung = {
  content: string;
  order: number;
  id: string;
};

export type note = {
  content: string;
  order: number;
  id: string;
};

export function ladderToRung(ladder: ladder): rung {
  return {
    content: ladder.name,
    id: ladder.id,
    order: ladder.order,
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
    id: rung.id,
    order: rung.order,
  };
}

export function rungsToLadders(rungs: rung[]): ladder[] {
  const processedData: ladder[] = [];

  rungs.forEach((rung: rung) => {
    processedData.push(rungToLadder(rung));
  });

  return processedData;
}
