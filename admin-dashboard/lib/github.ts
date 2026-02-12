import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

// Get a file's content from GitHub
export async function getFileContent(filePath: string): Promise<{ content: string; sha: string }> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    ref: BRANCH,
  });

  if ('content' in data) {
    return {
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
      sha: data.sha,
    };
  }
  throw new Error(`${filePath} is not a file`);
}

// Update a single file on GitHub (creates a commit)
export async function updateFile(
  filePath: string,
  newContent: string,
  commitMessage: string
): Promise<string> {
  const { sha } = await getFileContent(filePath);

  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message: commitMessage,
    content: Buffer.from(newContent).toString('base64'),
    sha,
    branch: BRANCH,
  });

  return data.commit.sha || '';
}

// Update multiple files in a single commit
export async function updateMultipleFiles(
  files: { path: string; content: string }[],
  commitMessage: string
): Promise<string> {
  // Get the latest commit SHA on the branch
  const { data: ref } = await octokit.git.getRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${BRANCH}`,
  });
  const latestCommitSha = ref.object.sha;

  // Get the tree SHA from that commit
  const { data: commit } = await octokit.git.getCommit({
    owner: OWNER,
    repo: REPO,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commit.tree.sha;

  // Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data: blob } = await octokit.git.createBlob({
        owner: OWNER,
        repo: REPO,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64',
      });
      return { path: file.path, sha: blob.sha };
    })
  );

  // Create a new tree with the updated files
  const { data: tree } = await octokit.git.createTree({
    owner: OWNER,
    repo: REPO,
    base_tree: baseTreeSha,
    tree: blobs.map((blob) => ({
      path: blob.path,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: blob.sha,
    })),
  });

  // Create the commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner: OWNER,
    repo: REPO,
    message: commitMessage,
    tree: tree.sha,
    parents: [latestCommitSha],
  });

  // Update the branch reference to point to the new commit
  await octokit.git.updateRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${BRANCH}`,
    sha: newCommit.sha,
  });

  return newCommit.sha;
}

// Upload an image file to GitHub repo
export async function uploadImageToGitHub(
  fileName: string,
  fileBuffer: Buffer,
  commitMessage: string
): Promise<string> {
  const filePath = `images/${fileName}`;

  // Check if file already exists (to get sha for overwrite)
  let existingSha: string | undefined;
  try {
    const { sha } = await getFileContent(filePath);
    existingSha = sha;
  } catch {
    // File doesn't exist yet, that's fine
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message: commitMessage,
    content: fileBuffer.toString('base64'),
    sha: existingSha,
    branch: BRANCH,
  });

  return filePath;
}
