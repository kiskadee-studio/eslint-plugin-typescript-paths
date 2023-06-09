export type ImportPrefixToAlias = {
  [key: string]: string;
};

export type GetExpectedPath = (
  absolutePath: string,
  baseUrl: string,
  importPrefixToAlias: ImportPrefixToAlias
) => string | undefined;
