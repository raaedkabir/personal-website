import fs from 'node:fs';

/**
 * The screenshots of the base commit that this branch is compared with. tests/e2e/run.sh (`pnpm test:e2e`)
 * builds the base commit, screenshots it into this folder and describes the result in baseline.json.
 */
export const baselineDir = new URL('../__snapshots__/', import.meta.url);

export type Baseline = {
  /** the commit the screenshots were taken from */
  base: string;
  /** a hash of the tests, the Playwright config and the lockfile; a change to any of them means re-recording */
  key: string;
  status: 'recorded' | 'unavailable';
  /** why there are no screenshots, when status is 'unavailable' */
  reason?: string;
};

export function readBaseline(): Baseline | undefined {
  try {
    return JSON.parse(fs.readFileSync(new URL('baseline.json', baselineDir), 'utf8')) as Baseline;
  } catch {
    return undefined;
  }
}

/** Set by tests/e2e/run.sh while it screenshots the base commit. */
export const recordingBaseline = !!process.env.VISUAL_BASELINE;
