import * as fs from 'fs/promises';
import * as path from 'path';
import { diffLines, Change } from 'diff';

export async function validateReplay(dom: string, expectedOutputFile: string) {
  const expected = await fs.readFile(expectedOutputFile, 'utf-8');
  const diff: Change[] = diffLines(expected, dom);
  const hasDiff = diff.some((part: Change) => part.added || part.removed);
  if (hasDiff) {
    console.log('Discrepancies found:');
    diff.forEach((part: Change) => {
      const color = part.added ? '\x1b[32m' : part.removed ? '\x1b[31m' : '\x1b[0m';
      process.stdout.write(color + part.value + '\x1b[0m');
    });
  } else {
    console.log('Replay matches expected output.');
  }
  return hasDiff;
}
