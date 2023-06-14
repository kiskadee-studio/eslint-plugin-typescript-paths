export type Paths = { [key: string]: string[] };

export type GetExpectedPath = (
  absolutePath: string,
  baseUrl: string,
  paths: Paths
) => string | undefined;
