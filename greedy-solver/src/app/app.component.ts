import { Component, ViewChild, OnInit } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { OptimizationResult } from './solve-result';
import { GreedySolver } from './greedy-solver';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'greedy-solver';

  private readonly worksLimitationAmount = 4;
  private readonly resourcesLimitationAmount = 1;

  private sample6x7: number[][] = [
    [1, 0, 0, 1, 0, 0, 40000],
    [0, 1, 0, 0, 1, 0, 2500],
    [0, 0, 1, 0, 0, 1, 2000],
    [0, 500, 500, 0, 1000, 500, 0],
    [20000, 1000, 1000, 30000, 5000, 1000, 0],
    [0.1, 0.025, 0.02, 0.11, 0.02, 0.025, 0],
    [1, 41.43, 44.76, 1, 41.43, 44.76, 0], // Currency conversion rates to UAH
  ];

  private sample7x9: number[][] = [
    [1, 0, 0, 0, 1, 0, 0, 0, 40000],
    [0, 1, 0, 0, 0, 1, 0, 0, 2500],
    [0, 0, 1, 0, 0, 0, 1, 0, 2000],
    [0, 0, 0, 1, 0, 0, 0, 1, 1500],
    [0, 500, 500, 500, 0, 1000, 500, 0, 0],
    [20000, 1000, 1000, 1000, 30000, 5000, 1000, 1000, 0],
    [0.1, 0.025, 0.02, 0.03, 0.11, 0.02, 0.025, 0.02, 0],
    [1, 41.43, 44.76, 53.71, 1, 41.43, 44.76, 53.71, 0], // Currency conversion rates to UAH
  ];

  private sample6x10: number[][] = [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 40000],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 3000],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 2500],
    [0, 500, 500, 0, 1000, 500, 5000, 1000, 1000, 0],
    [20000, 1000, 1000, 30000, 5000, 1000, 20000, 3000, 1500, 0],
    [0.1, 0.025, 0.02, 0.11, 0.02, 0.025, 0.095, 0.03, 0.025, 0],
    [1, 41.43, 44.76, 1, 41.43, 44.76, 1, 41.43, 44.76, 0], // Currency conversion rates to UAH
  ];

  @ViewChild(TableComponent, { static: true }) public table:
    | TableComponent
    | undefined;

  constructor() {}

  ngOnInit(): void {
    this.data = this.copyMatrix(this.sample6x7);
  }

  public data: number[][] = [];
  public selectedSampleSize: string = '6';

  public result: OptimizationResult | undefined;
  public executionTimeMs: number | undefined;

  public calculate(): void {
    const data = this.table!.dataSource.data;

    const numResources = data.length - this.worksLimitationAmount; // <-- 3 - кількість обмежень для робіт, 1 - курс валют (3 + 1)
    const numJobs = data[0].length - this.resourcesLimitationAmount; // <-- 1 - кількість обмежень для ресурсів

    const resourceLimits = data
      .slice(0, numResources)
      .map((row) => row[numJobs]);
    const minJobLimits = data[numResources].slice(0, numJobs);
    const maxJobLimits = data[numResources + 1].slice(0, numJobs);
    const rates = data[numResources + 2].slice(0, numJobs);
    const coefficients = data
      .slice(0, numResources)
      .map((row) => row.slice(0, numJobs));
    const currencyConversion = data[numResources + 3].slice(0, numJobs);

    const optimizer = new GreedySolver(
      resourceLimits,
      minJobLimits,
      maxJobLimits,
      rates,
      coefficients,
      currencyConversion
    );

    const startTimestampMs = performance.now();
    this.result = optimizer.optimize();
    const endTimestampMs = performance.now();

    this.executionTimeMs = Number(
      (endTimestampMs - startTimestampMs).toFixed(3)
    );

    console.log(this.result);
    console.log(`${endTimestampMs - startTimestampMs} ms`);
  }

  public setSample(change: MatRadioChange): void {
    let changedValue = +change.value;
    switch (changedValue) {
      case 6:
        this.data = this.copyMatrix(this.sample6x7);
        break;
      case 7:
        this.data = this.copyMatrix(this.sample7x9);
        break;
      case 10:
        this.data = this.copyMatrix(this.sample6x10);
        break;
    }
  }

  private copyMatrix(matrix: number[][]): number[][] {
    const result: number[][] = [];

    for (const row of matrix) {
      result.push(row.slice());
    }

    return result;
  }
}
