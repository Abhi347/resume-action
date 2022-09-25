import fs from 'fs-extra';
import path from 'path';

import {STATIC_DIR_PATH} from './constants';

export const writeStaticFile = (fileName: string, content: string) =>
  fs.writeFileSync(path.join(STATIC_DIR_PATH, fileName), content);
export const readFileSync = (filePath: string) =>
  fs.readFileSync(filePath).toLocaleString();
