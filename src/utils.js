export function getStarSize(sizeKB) {
  return Math.max(1, Math.min(4, sizeKB / 1000)); // repo size controls radius
}

export function getStarBrightness(stars) {
  return Math.max(0.3, Math.min(1, stars / 50)); // stargazer count controls brightness
}

export function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return (h >>> 0) / 4294967296;
}
