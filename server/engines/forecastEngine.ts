import modelArtifact from '../data/modelArtifact.json' with { type: 'json' };

export interface ForecastInputFeatures {
  currentStress: number;
  prevStress?: number;
  currentFatigue: number;
  sleepHours: number;
  dutyHours?: number;
  consecutiveNightShifts?: number;
}

export function predictNextDayStress(features: ForecastInputFeatures): {
  predictedStress: number;
  persistenceBaseline: number;
  modelVersion: string;
  provenance: string;
  benchmarkMae: number;
} {
  const { coefficients, intercept, scaling } = modelArtifact;

  const stressLag0 = features.currentStress;
  const stressLag1 = features.prevStress ?? features.currentStress;
  const fatigueLag0 = features.currentFatigue;
  const sleepDeficit = Math.max(0, 8 - features.sleepHours);
  const dutyOvertime = Math.max(0, (features.dutyHours ?? 8) - 8);
  const nightShifts = features.consecutiveNightShifts ?? 0;

  // Linear combination using versioned ridge parameters
  let rawPrediction =
    intercept +
    coefficients.stress_lag_0 * stressLag0 +
    coefficients.stress_lag_1 * stressLag1 +
    coefficients.fatigue_lag_0 * fatigueLag0 +
    coefficients.sleep_deficit_lag_0 * sleepDeficit +
    coefficients.duty_overtime_lag_0 * dutyOvertime +
    coefficients.consecutive_night_shifts * nightShifts;

  // Bound to valid rating range
  rawPrediction = Math.min(scaling.clip_max, Math.max(scaling.clip_min, rawPrediction));

  return {
    predictedStress: Math.round(rawPrediction * 10) / 10,
    persistenceBaseline: stressLag0,
    modelVersion: modelArtifact.version,
    provenance: modelArtifact.dataset_provenance,
    benchmarkMae: modelArtifact.benchmark_metrics.synthetic_test_mae
  };
}
