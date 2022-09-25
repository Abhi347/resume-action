import * as core from '@actions/core';
import {startRender} from './render';
import {startExpressServer, stopExpressServer} from './server';

const run = async (): Promise<void> => {
  try {
    await startExpressServer();
    await startRender();
    await stopExpressServer();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

run();
