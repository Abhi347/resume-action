import * as core from '@actions/core';

import {PORT} from './constants';
import {readFileSync} from './file';
import {getFileContent} from './github';
import {generateFragment, renderFinalHtml} from './pug';
import {renderPdf} from './puppeteer';

const buildDir = './build';
const isTest = core.getBooleanInput('isTest');

const getMdFileContent = () => {
  if (isTest) {
    return readFileSync('./template/resume.md');
  }
  return getFileContent(core.getInput('mdFilePath'));
};

export const startRender = async () => {
  try {
    const fileContent = await getMdFileContent();
    core.debug('Main: Generating Fragment from Markdown');
    await generateFragment(fileContent);
    core.debug('Main: rendering the HTML');
    renderFinalHtml();
    core.debug('Main: Rendering the PDF');
    if (!isTest) {
      await renderPdf({
        buildDir,
        pdfFileName: `${buildDir}/${core.getInput(
          'title',
        )} ${new Date().toISOString()}.pdf`,
        port: Number(PORT),
      });
    }
    core.debug('Main: Finished Rendering the PDF');
  } catch (e) {
    core.error(e as Error);
  }
};
