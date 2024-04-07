/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

export interface IConfig {
  baseHdoUrl: string;
}

const protocol = window.location.protocol;

export const configuration = (): IConfig => {
  return {
    baseHdoUrl:
      process.env.BASE_HDO_URL ||
      (protocol === 'https:'
        ? 'https://hdoapi.lhthuong.top'
        : 'http://hdoapi.lhthuong.top'),
    // baseHdoUrl: process.env.BASE_HDO_URL || 'http://localhost:8080',
  };
};
