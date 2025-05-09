import { recordSession } from './recorder/recordSession';
import { replaySession } from './replayer/replaySession';
import { validateReplay } from './replayer/validateReplay';
import { classifyAutomation } from './automation/classifyAutomation';
import * as path from 'path';

async function main() {
  const taskDescription = 'Demo: Visit example.com';
  const logFileName = 'example-session.json';
  const expectedOutputFile = path.join('data/expectedOutputs', 'example-expected.html');

  // 1. Record Session
  const logPath = await recordSession(taskDescription, logFileName);
  console.log('Session recorded at:', logPath);

  // 2. Replay Session
  const { dom } = await replaySession(logPath);
  console.log('Session replayed. DOM captured.');

  // 3. Validate Outcome
  const domDiff = await validateReplay(dom, expectedOutputFile);

  // 4. Classify Feasibility
  const errors: string[] = []; // TODO: Collect real errors from replay
  const feasibility = classifyAutomation(domDiff, errors);
  console.log('Automation Feasibility:', feasibility);
}

main().catch(console.error);
