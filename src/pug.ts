import markdown from 'markdown-it';
import pug from 'pug';
import {writeStaticFile} from './file';

const md = markdown('commonmark');

export const generateFragment = async (fileContent: string) => {
  const htmlContent = md.render(fileContent.toString());
  return writeStaticFile('fragment.html', htmlContent);
};

export const renderFinalHtml = () => {
  const compiledFunction = pug.compileFile('./template/template.pug');
  const renderedHtmlContent = compiledFunction({
    title: '',
  });
  return writeStaticFile('page.html', renderedHtmlContent);
};
