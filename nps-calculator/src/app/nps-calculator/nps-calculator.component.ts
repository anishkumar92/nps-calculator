import { Component } from '@angular/core';

@Component({
  selector: 'app-nps-calculator',
  templateUrl: './nps-calculator.component.html',
  styleUrls: ['./nps-calculator.component.scss'],
})
export class NpsCalculatorComponent {
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
  constructor() {}

  calculate(): void {
    const yearsToMaturity = this.contributeTill - this.age;
    let totalYourContribution = 0;
    let totalEmployerContribution = 0;
    let currentBalance = this.currentNpsBalance;

    for (let year = 0; year < yearsToMaturity; year++) {
      const yearlyYourContribution =
        (this.yourContribution + year * this.increaseContributionEveryYear) *
        12;
      const yearlyEmployerContribution =
        (this.employerContribution +
          year * this.increaseContributionEveryYear) *
        12;

      currentBalance += yearlyYourContribution + yearlyEmployerContribution;
      currentBalance = currentBalance * (1 + this.expectedReturn / 100);

      totalYourContribution += yearlyYourContribution;
      totalEmployerContribution += yearlyEmployerContribution;
    }

    this.totalInvestment =
      totalYourContribution +
      totalEmployerContribution +
      this.currentNpsBalance;
    this.maturityAmount = currentBalance;
    this.totalInterest = this.maturityAmount - this.totalInvestment;
    this.minAnnuityInvestment = 0.4 * this.maturityAmount; // Based on the 40% rule
  }
}
