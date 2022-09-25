import {getOctokit} from '@actions/github';

const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.TEST_TOKEN || '';

const octokit = getOctokit(GH_TOKEN);

const FULL_REPO_NAME = process.env.GITHUB_REPOSITORY;
const [OWNER, REPO] = FULL_REPO_NAME?.split('/') || '/';

export const readRepoFile = async (filePath: string) => {
  return octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: filePath,
  });
};

export const getFileContent = async (filePath: string) => {
  const {data} = await readRepoFile(filePath);
  return (data as typeof data & {content: string}).content;
};
