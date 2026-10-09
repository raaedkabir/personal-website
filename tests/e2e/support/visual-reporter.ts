import fs from 'node:fs';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { readBaseline } from './baseline';

type Row = { screenshot: string; project: string; change: string };

/**
 * Lists the screenshots that differ from the base commit at the end of the run. visual.spec.ts doesn't fail on
 * them, so this is where they show up: in the terminal, and in CI in the job summary and as a warning.
 */
export default class VisualChangesReporter implements Reporter {
  private readonly lastResults = new Map<string, { test: TestCase; result: TestResult }>();

  onTestEnd(test: TestCase, result: TestResult) {
    if (test.location.file.endsWith('visual.spec.ts')) this.lastResults.set(test.id, { test, result });
  }

  onEnd() {
    if (!this.lastResults.size) return;

    const rows: Row[] = [];
    for (const { test, result } of this.lastResults.values()) {
      const project = test.parent.project()?.name ?? '';
      for (const { type, description = '' } of result.annotations) {
        if (type !== 'visual change' && type !== 'no baseline') continue;
        const [screenshot = '', ...rest] = description.split(': ');
        const detail = rest.join(': ');
        rows.push({ screenshot, project, change: type === 'no baseline' ? `no baseline: ${detail}` : detail });
      }
    }
    rows.sort((a, b) => a.screenshot.localeCompare(b.screenshot) || a.project.localeCompare(b.project));

    const baseline = readBaseline();
    const notCompared = !baseline
      ? 'no base commit has been screenshotted; run pnpm test:e2e'
      : baseline.status === 'unavailable'
        ? baseline.reason
        : undefined;
    const base = baseline?.base.slice(0, 7);
    const screenshots = [...new Set(rows.map((row) => row.screenshot))];

    if (notCompared) console.log(`\nScreenshots weren't compared with a base commit: ${notCompared}`);
    else {
      console.log(`\nScreenshots compared with the base commit ${base}:${rows.length ? '' : ' no differences'}`);
      for (const row of rows) console.log(`  ${row.screenshot} (${row.project}): ${row.change}`);
      if (rows.length) {
        console.log('  pnpm test:e2e:report shows the images: base (expected), new (actual) and diff of each change, also in');
        console.log('  test-results/, and the new screenshot of each one without a baseline.');
      }
    }

    if (process.env.GITHUB_STEP_SUMMARY) {
      const summary: string[] = [];
      if (notCompared) summary.push(`### Screenshots weren't compared with the base branch`, '', `${notCompared}.`);
      else {
        summary.push(`### Screenshots compared with the base commit \`${base}\``, '');
        if (!rows.length) summary.push('No differences.');
        else {
          summary.push('| Screenshot | Project | Change |', '| --- | --- | --- |');
          for (const row of rows) summary.push(`| ${row.screenshot} | ${row.project} | ${row.change} |`);
          summary.push(
            '',
            'The `playwright-report` artifact has the base (expected), new (actual) and diff images of each change, and the new screenshot of each one without a baseline.',
          );
        }
      }
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join('\n')}\n\n`);
    }

    if (process.env.GITHUB_ACTIONS) {
      if (notCompared) console.log(`::warning title=Screenshots not compared::${notCompared}`);
      else if (screenshots.length) {
        console.log(`::warning title=Screenshots changed::${screenshots.join(', ')} differ from the base commit; see the job summary`);
      }
    }
  }
}
