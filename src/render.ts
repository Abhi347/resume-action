import * as core from '@actions/core';

import {PORT} from './constants';
import {getFileContent} from './github';
import {generateFragment, renderFinalHtml} from './pug';
import {renderPdf} from './puppeteer';

const buildDir = './build';

export const startRender = async () => {
  try {
    const fileContent = await getFileContent(core.getInput('mdFilePath'));
    core.debug('Main: Generating Fragment from Markdown');
    await generateFragment(fileContent);
    core.debug('Main: rendering the HTML');
    renderFinalHtml();
    core.debug('Main: Rendering the PDF');
    await renderPdf({
      buildDir,
      pdfFileName: `${buildDir}/${core.getInput(
        'title',
      )} ${new Date().toISOString()}.pdf`,
      port: Number(PORT),
    });
    core.debug('Main: Finished Rendering the PDF');
  } catch (e) {
    core.error(e as Error);
  }
};
