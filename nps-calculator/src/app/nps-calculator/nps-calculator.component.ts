import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts/highcharts.src';
@Component({
  selector: 'app-nps-calculator',
  templateUrl: './nps-calculator.component.html',
  styleUrls: ['./nps-calculator.component.scss'],
})
export class NpsCalculatorComponent implements OnInit, AfterViewInit {
  @ViewChild('chartRef', { static: false })
  chartElement!: ElementRef<HTMLElement>;
  chart!: Highcharts.Chart;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  age: number = 31;
  currentNpsBalance: number = 500000;
  yourContribution: number = 5000; // Monthly
  employerContribution: number = 5000; // Monthly
  increaseContributionEveryYear: number = 10; // in Rupees
  expectedReturn: number = 5; // in percentage
  contributeTill: number = 60; // default to 60 years

  // These will hold our calculated values
  totalInvestment: number = 0;
  totalInterest: number = 0;
  maturityAmount: number = 0;
  minAnnuityInvestment: number = 0;
  // Results
  amountAtRetirement: number = 0;
  yourTotalContributions: number = 0;
  employerTotalContributions: number = 0;
  totalContributions: number = 0;
  totalReturns: number = 0;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      title: {
        text: 'NPS Results',
      },
      xAxis: {
        categories: [
          'Amount at Retirement',
          'Your Contributions (A)',
          'Employer Contributions (B)',
          'Total Contributions (A + B)',
          'Total Returns',
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount in ₹',
        },
      },
      series: [
        {
          name: 'Contributions',
          type: 'column',
          data: [
            this.totalContributions,
            this.yourTotalContributions,
            this.employerTotalContributions,
            this.totalContributions,
            0, // No contributions for the "Total Returns" column
          ],
          color: 'rgba(54, 162, 235, 0.6)',
        },
        {
          name: 'Profit',
          type: 'column',
          data: [
            this.amountAtRetirement - this.totalContributions,
            0, // No profit for the "Your Contributions" column
            0, // No profit for the "Employer Contributions" column
            0, // No profit for the "Total Contributions" column
            this.totalReturns,
          ],
          color: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }

  calculate(): void {
    const yearsToMaturity = this.contributeTill - this.age;
    let totalYourContribution = 0;
    let totalEmployerContribution = 0;
    let currentBalance = this.currentNpsBalance;

    for (let year = 0; year < yearsToMaturity; year++) {
      let yearlyYourContribution =
        (this.yourContribution + this.increaseContributionEveryYear * year) *
        12;
      let yearlyEmployerContribution =
        (this.employerContribution +
          this.increaseContributionEveryYear * year) *
        12;

      totalYourContribution += yearlyYourContribution;
      totalEmployerContribution += yearlyEmployerContribution;

      // Add contributions to the current balance
      currentBalance += yearlyYourContribution + yearlyEmployerContribution;

      // Compound the interest
      currentBalance = currentBalance * (1 + this.expectedReturn / 100);
    }

    this.totalInvestment = totalYourContribution + totalEmployerContribution;
    this.maturityAmount = currentBalance;
    this.totalInterest = this.maturityAmount - this.totalInvestment;

    // Calculate amountAtRetirement
    this.amountAtRetirement = this.maturityAmount;

    // Calculate yourTotalContributions
    this.yourTotalContributions = totalYourContribution;

    // Calculate employerTotalContributions
    this.employerTotalContributions = totalEmployerContribution;

    // Calculate totalContributions
    this.totalContributions =
      this.yourTotalContributions +
      this.employerTotalContributions +
      this.currentNpsBalance;

    // Calculate totalReturns
    this.totalReturns = this.totalInterest;
    this.updateChartData();
    this.cdr.detectChanges();
  }
  // updateChartData() {
  //   // if (this.chart) {
  //   // Ensure the chart is initialized
  //   this.chart.series[0].setData([
  //     { y: this.amountAtRetirement, color: 'rgba(75, 192, 192, 0.6)' },
  //     { y: this.yourTotalContributions, color: 'rgba(54, 162, 235, 0.6)' },
  //     { y: this.employerTotalContributions, color: 'rgba(54, 162, 235, 0.6)' },
  //     { y: this.totalContributions, color: 'rgba(54, 162, 235, 0.6)' },
  //     { y: this.totalReturns, color: 'rgba(75, 192, 192, 0.6)' },
  //   ]);
  // }
  // }

  updateChartData() {
    if (this.chart) {
      this.chart.series[0].setData([
        this.totalContributions,
        this.yourTotalContributions,
        this.employerTotalContributions,
        this.totalContributions,
        0,
      ]);

      this.chart.series[1].setData([
        this.amountAtRetirement - this.totalContributions,
        0,
        0,
        0,
        this.totalReturns,
      ]);
    }
  }

  ngAfterViewInit() {
    this.chart = (this.chartElement as any).chart;
  }
}
