import {getOctokit} from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';

const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.TEST_TOKEN || '';

let octokit: InstanceType<typeof GitHub>;

const getCachedOctokit = () => {
  if (octokit) {
    return octokit;
  }
  octokit = getOctokit(GH_TOKEN);
  return octokit;
};

const FULL_REPO_NAME = process.env.GITHUB_REPOSITORY;
const [OWNER, REPO] = FULL_REPO_NAME?.split('/') || '/';

export const readRepoFile = async (filePath: string) => {
  return getCachedOctokit().rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: filePath,
  });
};

export const getFileContent = async (filePath: string) => {
  const {data} = await readRepoFile(filePath);
  return (data as typeof data & {content: string}).content;
};
