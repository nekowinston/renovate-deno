export type RenovateConfig = {
  customManagers: {
    customType: string;
    fileMatch: string[];
    matchStrings: string[];
    datasourceTemplate: string;
  }[];
  // etc.
  [key: string]: unknown;
};

export const getMatches = (renovateCfg: RenovateConfig, input: string) => {
  const regexes = renovateCfg.customManagers.flatMap((manager) => manager.matchStrings.map((matchString) => new RegExp(matchString, "gm")));

  return regexes
    .map((r) => Array.from(input.matchAll(r)).map((m) => m.groups))
    .filter((m) => m.length !== 0)
    .flat();
};
