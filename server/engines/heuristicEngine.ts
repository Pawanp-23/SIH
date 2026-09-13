import { HeuristicContributors, ReviewBand } from '../../src/types.js';

export function calculateHeuristicIndex(
  stress: number,
  fatigue: number,
  sleepHours: number,
  dutyHours?: number,
  baselineSleepAvg: number = 7.0
): {
  index: number;
  band: ReviewBand;
  coverage: number;
  contributors: HeuristicContributors;
} {
  // Clamp and normalize
  const clampedStress = Math.min(5, Math.max(1, stress));
  const clampedFatigue = Math.min(5, Math.max(1, fatigue));
  const clampedSleep = Math.min(24, Math.max(0, sleepHours));

  const stressComp = (clampedStress - 1) / 4;
  const fatigueComp = (clampedFatigue - 1) / 4;
  const sleepComp = Math.min(1, Math.max(0, (8 - clampedSleep) / 4));

  let index = 0;
  let coverage = 1.0;
  let workloadComp = 0;

  if (typeof dutyHours === 'number' && !isNaN(dutyHours)) {
    const clampedDuty = Math.min(24, Math.max(0, dutyHours));
    workloadComp = Math.min(1, Math.max(0, (clampedDuty - 8) / 8));
    index = 100 * (
      0.35 * stressComp +
      0.25 * fatigueComp +
      0.25 * sleepComp +
      0.15 * workloadComp
    );
    coverage = 1.0;
  } else {
    // Missing duty hours: renormalize across the remaining 0.85 weight
    coverage = 0.85;
    const rawSum = 0.35 * stressComp + 0.25 * fatigueComp + 0.25 * sleepComp;
    index = 100 * (rawSum / 0.85);
  }

  // Rounded to 1 decimal place
  const finalIndex = Math.round(index * 10) / 10;

  let band: ReviewBand = 'routine';
  if (finalIndex >= 65) {
    band = 'review';
  } else if (finalIndex >= 40) {
    band = 'watch';
  }

  // Generate clear, objective explanations
  const explanations: string[] = [];
  const sleepDelta = baselineSleepAvg > 0 ? Math.round((clampedSleep - baselineSleepAvg) * 10) / 10 : 0;

  if (sleepDelta <= -1.5) {
    explanations.push(`Reported sleep is ${Math.abs(sleepDelta)}h below your recent baseline (${baselineSleepAvg}h).`);
  } else if (clampedSleep <= 5.0) {
    explanations.push(`Reported acute sleep deficit (${clampedSleep} hours logged).`);
  }

  if (clampedStress >= 4) {
    explanations.push(`Elevated perceived stress level (${clampedStress}/5 logged).`);
  }

  if (clampedFatigue >= 4) {
    explanations.push(`Substantial perceived physical fatigue (${clampedFatigue}/5 logged).`);
  }

  if (dutyHours && dutyHours >= 12) {
    explanations.push(`Extended shift duration (${dutyHours} duty hours in last 24h).`);
  }

  if (explanations.length === 0) {
    explanations.push('Values indicate stable baseline conditions.');
  }

  return {
    index: finalIndex,
    band,
    coverage,
    contributors: {
      stressScore: Math.round(stressComp * 100),
      fatigueScore: Math.round(fatigueComp * 100),
      sleepScore: Math.round(sleepComp * 100),
      workloadScore: Math.round(workloadComp * 100),
      sleepDeltaFromBaseline: sleepDelta,
      explanations
    }
  };
}
