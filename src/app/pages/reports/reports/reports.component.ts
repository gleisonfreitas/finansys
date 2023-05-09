import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from 'currency-formatter';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal = 0;
  revenueTotal = 0;
  balance = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{ ticks: { beginAtZero: true }}]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;


  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }


  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert('month and year are required!');
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this));
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let revenueTotal = 0;
    let expenseTotal = 0;
    this.entries.forEach( entry => {
      if (entry.type === 'revenue') {
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      } else {
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      }
    });

    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' });
    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' });
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' });
  }

  private setChartData() {
    const chartRevenueData = [];
    const chartExpenseData = [];


    this.categories.forEach( category => {
      // filtering entries by category and type

      const revenuesEntries = this.entries.filter(
        entry => (entry.categoryId === category.id) && (entry.type === 'revenue')
      );

      const expensesEntries = this.entries.filter(
        entry => (entry.categoryId === category.id) && (entry.type === 'expense')
      );

      // if found entries, then sum entries amount and add to chartRevenueData
      if ( revenuesEntries.length > 0) {
        const totalAmount = revenuesEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL'}), 0
        );

        chartRevenueData.push(
          {
            categoryName: category.name,
            totalAmount
          }
        );
      }

      // if found entries, then sum entries amount and add to chartExpenseData
      if ( expensesEntries.length > 0) {
        const totalAmount = expensesEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL'}), 0
        );

        chartExpenseData.push(
          {
            categoryName: category.name,
            totalAmount
          }
        );
      }

    });

    this.revenueChartData = {
      labels: chartRevenueData.map(item => item.categoryName),
      datasets: [{
        label: 'Revenues Chart',
        backgroundColor: '#9CCC65',
        data: chartRevenueData.map(item => item.totalAmount)
      }]
    };

    this.expenseChartData = {
      labels: chartExpenseData.map(item => item.categoryName),
      datasets: [{
        label: 'Expense Chart',
        backgroundColor: '#E03131',
        data: chartExpenseData.map(item => item.totalAmount)
      }]
    };
  }

}
