import express from 'express';
import * as core from '@actions/core';
import {Server} from 'http';
import {PORT, STATIC_DIR_PATH} from './constants';

const app = express();
app.use(express.static(STATIC_DIR_PATH));

let server: Server;

export const startExpressServer = () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, (err?: Error) => {
      if (err) {
        reject(err);
      }
      core.debug(`Express Server started at port ${PORT}`);
      resolve(server);
    });
  });
};

export const stopExpressServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
