import fs from 'fs';
import fetch from 'node-fetch';
import { getStarSize, getStarBrightness, seededRandom } from './utils.js';

const GITHUB_USER = process.env.GITHUB_USER;
const TOKEN = process.env.GITHUB_TOKEN; // from GitHub Actions secrets

async function fetchRepos() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  return res.json();
}

async function fetchRecentCommits(repo) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=5`, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  return res.json();
}

function generateSVG(repos) {
  const width = 800;
  const height = 400;
  let stars = '';
  let shootingStars = '';

  repos.forEach((repo, i) => {
    const x = Math.floor(seededRandom(repo.name) * width);
    const y = Math.floor(seededRandom(repo.name + "y") * height);
    const radius = getStarSize(repo.size);
    const brightness = getStarBrightness(repo.stargazers_count);

    stars += `<circle cx="${x}" cy="${y}" r="${radius}" fill="white" opacity="${brightness}">
                <animate attributeName="opacity" values="${brightness};${brightness - 0.2};${brightness}" dur="2s" repeatCount="indefinite"/>
              </circle>`;
  });

  shootingStars = `<line x1="100" y1="50" x2="120" y2="70" stroke="white" stroke-width="1">
                     <animate attributeName="x1" from="100" to="800" dur="3s" repeatCount="indefinite"/>
                     <animate attributeName="y1" from="50" to="400" dur="3s" repeatCount="indefinite"/>
                   </line>`;

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="black" />
  ${stars}
  ${shootingStars}
</svg>
  `;
}

(async () => {
  const repos = await fetchRepos();
  const svg = generateSVG(repos);
  fs.writeFileSync('./output/constellation.svg', svg);
})();
