import * as core from '@actions/core';

import fs from 'fs-extra';
import path from 'path';
import markdown from 'markdown-it';
import pug from 'pug';
import puppeteer, {PDFOptions} from 'puppeteer';
import {PORT, STATIC_DIR_PATH} from './constants';
import {getFileContent} from './github';

const md = markdown('commonmark');

const buildDir = './build';

const writeTempFile = (fileName: string, content: string) => {
  fs.writeFileSync(path.join(STATIC_DIR_PATH, fileName), content);
};

const getCurrentDate = (): string => {
  return new Date().toISOString();
};

const generateFragment = async (fileContent: string) => {
  const htmlContent = md.render(fileContent.toString());
  writeTempFile('fragment.html', htmlContent);
};

const renderHtml = () => {
  const compiledFunction = pug.compileFile('./template/template.pug');
  const renderedHtmlContent = compiledFunction({
    title: '',
  });
  writeTempFile('page.html', renderedHtmlContent);
};

const renderPdf = async () => {
  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);
  const pagePath = `http://localhost:${PORT}/page.html`;
  const exportFilename = `${buildDir}/${core.getInput(
    'title',
  )} ${getCurrentDate()}.pdf`;
  const browser = await puppeteer.launch({
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

export const startRender = async () => {
  try {
    const fileContent = await getFileContent(core.getInput('mdFilePath'));
    core.debug('Main: Generating Fragment from Markdown');
    await generateFragment(fileContent);
    core.debug('Main: rendering the HTML');
    renderHtml();
    core.debug('Main: Rendering the PDF');
    await renderPdf();
    core.debug('Main: Finished Rendering the PDF');
  } catch (e) {
    core.error(e as Error);
  }
};
