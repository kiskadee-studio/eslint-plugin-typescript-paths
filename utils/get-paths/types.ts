export interface TSConfig {
  compilerOptions?: {
    baseUrl?: string;
    paths?: {
      [key: string]: string[];
    };
  };
}

export type Paths = { [key: string]: string[] } | undefined;

export type BaseURLPaths = [baseUrl: string, paths?: Paths];
