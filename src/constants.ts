import path from 'path';

export const PORT = process.env.PORT || 4000;
export const STATIC_DIR = '../static';
export const STATIC_DIR_PATH = path.join(__dirname, STATIC_DIR);
