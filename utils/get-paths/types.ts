export interface TSConfig {
  compilerOptions?: {
    baseUrl?: string;
    paths?: {
      [key: string]: string[];
    };
  };
}

export type Paths = { [key: string]: string[] };
export type PathAlias = {
  [key: string]: string;
};

export type BaseURLPaths = [baseUrl: string, paths: Paths];
