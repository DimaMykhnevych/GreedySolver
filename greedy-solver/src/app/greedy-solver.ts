import { OptimizationResult, OptimizationStep } from './solve-result';

export class GreedySolver {
  private readonly depositNames: string[];

  constructor(
    private resourceLimits: number[],
    private minJobLimits: number[],
    private maxJobLimits: number[],
    private rates: number[],
    private coefficients: number[][],
    private currencyConversion: number[],
    depositNames?: string[]
  ) {
    this.depositNames =
      depositNames ||
      Array(rates.length)
        .fill(0)
        .map((_, i) => `Deposit ${i + 1}`);
  }

  public optimize(): OptimizationResult {
    const numResources = this.resourceLimits.length;
    const numJobs = this.rates.length;
    const distribution = new Array(numJobs).fill(0);
    const remainingResources = [...this.resourceLimits];
    let totalProfit = 0;
    const steps: OptimizationStep[] = [];

    const depositOptions = this.rates
      .map((rate, index) => ({
        index,
        rate: rate + 1,
        name: this.depositNames[index],
      }))
      .sort((a, b) => b.rate - a.rate);

    depositOptions.forEach((option, stepIndex) => {
      const jobIndex = option.index;
      const possibleAmounts: number[] = [];

      for (let i = 0; i < numResources; i++) {
        if (this.coefficients[i][jobIndex] === 1) {
          if (remainingResources[i] >= this.minJobLimits[jobIndex]) {
            const maxPossible = Math.min(
              remainingResources[i],
              this.maxJobLimits[jobIndex]
            );
            possibleAmounts.push(maxPossible);
          }
        }
      }

      if (possibleAmounts.length > 0) {
        const amount = Math.min(...possibleAmounts);

        if (amount >= this.minJobLimits[jobIndex]) {
          distribution[jobIndex] = amount;

          for (let i = 0; i < numResources; i++) {
            if (this.coefficients[i][jobIndex] === 1) {
              remainingResources[i] -= amount;
            }
          }

          const stepProfit = amount * (this.rates[jobIndex] + 1) - amount;
          totalProfit += stepProfit;

          steps.push({
            stepNumber: stepIndex + 1,
            depositName: option.name,
            depositAmount: amount,
            currentDistribution: [...distribution],
            remainingResources: [...remainingResources],
            stepProfit: stepProfit,
            totalProfit: totalProfit,
          });
        }
      }
    });

    // Calculate final maximization value in UAH
    const finalMaximizationValue = distribution.reduce((sum, amount, index) => {
      // Convert amount to UAH and multiply by rate
      return (
        sum + amount * this.currencyConversion[index] * (this.rates[index] + 1)
      );
    }, 0);

    return {
      finalDistribution: distribution,
      finalProfit: totalProfit,
      finalRemainingResources: remainingResources,
      finalMaximizationValue,
      steps: steps,
    };
  }
}
