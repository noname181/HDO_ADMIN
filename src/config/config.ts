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
        ? 'http://158.247.249.66:8080'
        : 'http://lhthuong.top:8080'),
    // baseHdoUrl: process.env.BASE_HDO_URL || 'http://localhost:8080',
  };
};
