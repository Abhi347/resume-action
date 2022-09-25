import fs from 'fs-extra';
import puppeteer, {PDFOptions} from 'puppeteer';

import * as core from '@actions/core';

interface RenderOptions {
  port: number;
  buildDir: string;
  pdfFileName: string;
}

export const renderPdf = async ({
  buildDir,
  port,
  pdfFileName,
}: RenderOptions) => {
  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);
  const pagePath = `http://localhost:${port}/page.html`;
  const exportFilename = `${pdfFileName}.pdf`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  //     {
  //     executablePath: '../dist/'
  // });
  const page = await browser.newPage();
  core.debug('renderPdf: opened Page');
  await page.goto(pagePath);
  core.debug('renderPdf: going to the uri');
  const options: PDFOptions = {
    format: 'A4',
    margin: {
      bottom: '20px',
      left: '20px',
      right: '20px',
      top: '20px',
    },
    path: exportFilename,
  };
  core.debug('renderPDf: rendering pdf');
  await page.pdf(options);
  core.debug('renderPDf: closing browser');
  await browser.close();
  core.debug('renderPDf: browser closed');
};
