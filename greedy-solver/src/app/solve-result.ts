export interface OptimizationStep {
  stepNumber: number;
  depositName: string;
  depositAmount: number;
  currentDistribution: number[];
  remainingResources: number[];
  stepProfit: number;
  totalProfit: number;
}

export interface OptimizationResult {
  finalDistribution: number[];
  finalProfit: number;
  finalRemainingResources: number[];
  finalMaximizationValue: number;
  steps: OptimizationStep[];
}
