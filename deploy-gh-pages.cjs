// Deploy built dist/ to GitHub Pages via API
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GH_TOKEN;
const OWNER = 'Monday-today';
const REPO = 'cici-and-monday';

if (!TOKEN) {
  console.error('Usage: GH_TOKEN=ghp_xxx node deploy-gh-pages.cjs');
  process.exit(1);
}

const octokit = new Octokit({ auth: TOKEN });

function walkDir(dir, base) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(base, fullPath).split(path.sep).join('/');
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, base));
    } else {
      results.push({ path: relativePath, fullPath });
    }
  }
  return results;
}

async function deploy() {
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found. Run: npm run build');
    process.exit(1);
  }

  console.log('Building file list...');
  const files = walkDir(distDir, distDir);
  console.log('Found ' + files.length + ' files');

  console.log('Uploading to gh-pages...');
  const treeItems = [];
  for (const file of files) {
    const content = fs.readFileSync(file.fullPath);
    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: content.toString(),
    });
  }

  const { data: tree } = await octokit.git.createTree({ owner: OWNER, repo: REPO, tree: treeItems });
  const { data: commit } = await octokit.git.createCommit({
    owner: OWNER, repo: REPO,
    message: 'Deploy site update',
    tree: tree.sha,
    parents: [],
  });

  try {
    await octokit.git.updateRef({
      owner: OWNER, repo: REPO,
      ref: 'heads/gh-pages',
      sha: commit.sha,
      force: true,
    });
  } catch (e) {
    if (e.status === 422) {
      await octokit.git.createRef({
        owner: OWNER, repo: REPO,
        ref: 'refs/heads/gh-pages',
        sha: commit.sha,
      });
    } else throw e;
  }

  console.log('Deployed! Visit: https://monday-today.github.io/cici-and-monday/');
}

deploy().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
