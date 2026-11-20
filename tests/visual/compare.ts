// Compares two sets of screenshots taken by capture.spec.ts and writes a report on the ones that differ:
//
//   node tests/visual/compare.ts <before> <after> <report>
//
// <report>/comment.md   the PR comment, with images linked relative to <report>
// <report>/summary.md   the same without images, for the job summary
// <report>/report.json  each changed, new or removed screenshot
// <report>/images/      the before, after and diff images, cropped to the rows that changed
//
// The two builds are screenshotted on the same machine, so unchanged pages match pixel for pixel and any difference
// is a real one.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { describeScreenshot } from './names.ts';

const [beforeDir, afterDir, reportDir] = process.argv.slice(2);
if (!reportDir) {
  console.error('Usage: node tests/visual/compare.ts <before> <after> <report>');
  process.exit(1);
}

// the Playwright projects in playwright.visual.config.ts
const viewports = [
  { project: 'desktop', label: 'desktop' },
  { project: 'mobile', label: 'phone' },
];
// rows of unchanged page kept above and below the changed ones, for context
const margin = 100;
// the most rows an image in the comment shows
const maxRows = 1600;
// the most screenshots the comment shows images for, to keep it readable (the rest are only listed)
const maxShown = 20;
// above this many differing screenshots, their images start collapsed
const maxOpen = 6;

type Status = 'changed' | 'new' | 'removed';
interface Result {
  name: string;
  route: string;
  state?: string;
  viewport: string;
  status: Status;
  // the share of pixels that differ, for changed screenshots
  changed?: number;
  // the first and last rows that differ, for changed screenshots, and the rows the cropped images show
  changedRows?: [number, number];
  shownRows: [number, number];
  height: number;
  images: { before?: string; after?: string; diff?: string };
}

const readPNG = (file: string) => PNG.sync.read(readFileSync(file));
const listPNGs = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith('.png')).map((file) => file.slice(0, -4)) : [];

// a copy of rows [top, top + rows) of the image, padded with transparent pixels to width and to the given rows
function crop(image: PNG, top: number, rows: number, width = image.width): PNG {
  const out = new PNG({ width, height: rows });
  const copied = Math.max(0, Math.min(rows, image.height - top));
  if (copied > 0) PNG.bitblt(image, out, 0, top, image.width, copied, 0, 0);
  return out;
}

function save(image: PNG, path: string) {
  writeFileSync(join(reportDir, path), PNG.sync.write(image, { deflateLevel: 9 }));
  return path;
}

rmSync(reportDir, { recursive: true, force: true });
const results: Result[] = [];
let total = 0;

for (const { project, label } of viewports) {
  const before = new Set(listPNGs(join(beforeDir, project)));
  const after = new Set(listPNGs(join(afterDir, project)));
  const names = [...new Set([...before, ...after])];
  total += names.length;
  mkdirSync(join(reportDir, 'images', project), { recursive: true });

  for (const name of names) {
    const image = (side: string) => `images/${project}/${name}.${side}.png`;
    const about = { name, ...describeScreenshot(name), viewport: label };

    if (!before.has(name) || !after.has(name)) {
      // a page or state only one build has: show the top of it
      const status: Status = before.has(name) ? 'removed' : 'new';
      const screenshot = readPNG(join(status === 'new' ? afterDir : beforeDir, project, `${name}.png`));
      const rows = Math.min(screenshot.height, maxRows);
      const path = save(crop(screenshot, 0, rows), image(status === 'new' ? 'after' : 'before'));
      results.push({
        ...about,
        status,
        height: screenshot.height,
        shownRows: [0, rows - 1],
        images: status === 'new' ? { after: path } : { before: path },
      });
      continue;
    }

    const beforeImage = readPNG(join(beforeDir, project, `${name}.png`));
    const afterImage = readPNG(join(afterDir, project, `${name}.png`));
    // a page that got longer or shorter is compared as if the shorter one had transparent rows at the end
    const width = Math.max(beforeImage.width, afterImage.width);
    const height = Math.max(beforeImage.height, afterImage.height);
    const paddedBefore = crop(beforeImage, 0, height, width);
    const paddedAfter = crop(afterImage, 0, height, width);
    const diff = new PNG({ width, height });
    const changedPixels = pixelmatch(paddedBefore.data, paddedAfter.data, diff.data, width, height);
    if (changedPixels === 0) continue;

    // the rows pixelmatch marked in its diff colour, pure red; the rest of the diff image is greyscale
    let first = height;
    let last = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) {
          first = Math.min(first, y);
          last = y;
          break;
        }
      }
    }
    const top = Math.max(0, first - margin);
    const rows = Math.min(height - top, last + margin - top + 1, maxRows);

    results.push({
      ...about,
      status: 'changed',
      changed: changedPixels / (width * height),
      changedRows: [first, last],
      shownRows: [top, top + rows - 1],
      height,
      images: {
        before: save(crop(paddedBefore, top, rows), image('before')),
        after: save(crop(paddedAfter, top, rows), image('after')),
        diff: save(crop(diff, top, rows), image('diff')),
      },
    });
  }
}

// in page order, each page's states after it, and desktop before phone
const viewportOrder = viewports.map(({ label }) => label);
results.sort(
  (a, b) =>
    a.route.localeCompare(b.route) ||
    (a.state ?? '').localeCompare(b.state ?? '') ||
    viewportOrder.indexOf(a.viewport) - viewportOrder.indexOf(b.viewport),
);

// the comment

const px = (n: number) => `${n.toLocaleString('en-US')} px`;
const percent = (share: number) => (share < 0.001 ? '<0.1%' : `${(share * 100).toFixed(1)}%`);
const markdownLabel = ({ route, state }: Result) => `\`${route}\`${state ? `, ${state}` : ''}`;
const htmlLabel = ({ route, state }: Result) => `<code>${route}</code>${state ? `, ${state}` : ''}`;
const plainLabel = ({ route, state }: Result) => `${route}${state ? ` (${state})` : ''}`;
const img = (src: string, alt: string) => `<img src="${src}" alt="${alt}">`;

function describe(result: Result) {
  if (result.status === 'changed') return `${percent(result.changed!)} changed`;
  return result.status;
}

function section(result: Result, open: boolean) {
  const { viewport, status, images, height } = result;
  const [shownTop, shownBottom] = result.shownRows;
  const alt = (side: string) => `${plainLabel(result)} on ${viewport}, ${side}`;
  const lines = [
    `<details${open ? ' open' : ''}>`,
    `<summary>${htmlLabel(result)} on ${viewport}: ${describe(result)}</summary>`,
    '',
  ];

  if (status === 'changed') {
    const [first, last] = result.changedRows!;
    const cut = shownBottom < last ? ' The change continues below that.' : '';
    lines.push(
      `Changed from ${px(first)} to ${px(last)} down the screenshot, which is ${px(height)} tall. Showing ${px(shownTop)} to ${px(shownBottom)}.${cut}`,
      '',
      '| Before | After |',
      '| --- | --- |',
      `| ${img(images.before!, alt('before'))} | ${img(images.after!, alt('after'))} |`,
      '',
      '<details><summary>Diff, changed pixels in red</summary>',
      '',
      img(images.diff!, alt('diff')),
      '',
      '</details>',
    );
  } else {
    const what = result.state ? 'state' : 'page';
    const where = status === 'new' ? `The base doesn't have this ${what}.` : `This change removes this ${what}.`;
    const cut = shownBottom < height - 1 ? ` Showing the top ${px(shownBottom + 1)} of ${px(height)}.` : '';
    lines.push(`${where}${cut}`, '', img((images.after ?? images.before)!, alt(status === 'new' ? 'after' : 'before')));
  }

  lines.push('</details>', '');
  return lines.join('\n');
}

// one table row per page or state, with a column per viewport
const tableRows = [...new Map(results.map((result) => [plainLabel(result), result])).values()];
const cell = (row: Result, viewport: string) => {
  const result = results.find((r) => plainLabel(r) === plainLabel(row) && r.viewport === viewport);
  return result ? describe(result) : 'no change';
};

const headline =
  results.length === 0
    ? `No visual changes: all ${total} screenshots match.`
    : `**${results.length} of ${total} screenshots changed.**`;
const summary = [
  '<!-- visual-diff -->',
  '## Visual diff',
  '',
  `${headline} Every page is screenshotted at desktop and phone widths, before and after this change. Canvases and embeds are greyed out, so changes inside them don't show.`,
  '',
  ...(tableRows.length
    ? [
        `| Page | ${viewportOrder.map((label) => label[0].toUpperCase() + label.slice(1)).join(' | ')} |`,
        `| --- | ${viewportOrder.map(() => '---').join(' | ')} |`,
        ...tableRows.map((row) => `| ${markdownLabel(row)} | ${viewportOrder.map((label) => cell(row, label)).join(' | ')} |`),
        '',
      ]
    : []),
];

const comment = [
  ...summary,
  '<!-- visual-diff:images -->',
  ...results.slice(0, maxShown).map((result) => section(result, results.length <= maxOpen)),
  ...(results.length > maxShown
    ? [`Images for the other ${results.length - maxShown} are in the workflow run's \`visual-diff\` artifact.`, '']
    : []),
  '<!-- /visual-diff:images -->',
];

writeFileSync(join(reportDir, 'comment.md'), comment.join('\n'));
writeFileSync(join(reportDir, 'summary.md'), summary.join('\n'));
writeFileSync(join(reportDir, 'report.json'), `${JSON.stringify(results, null, 2)}\n`);

console.log(headline.replaceAll('**', ''));
for (const result of results) console.log(`  ${plainLabel(result)} on ${result.viewport}: ${describe(result)}`);
console.log(`Report in ${join(reportDir, 'comment.md')}`);
