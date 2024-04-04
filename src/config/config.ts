/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

export interface IConfig {
  baseHdoUrl: string;
}

export const configuration = (): IConfig => {
  return {
    baseHdoUrl: process.env.BASE_HDO_URL || 'https://api.abc7979.net',
    // baseHdoUrl: process.env.BASE_HDO_URL || 'http://localhost:8080',
  };
};
