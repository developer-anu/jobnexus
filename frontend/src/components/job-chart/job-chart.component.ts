import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // ✅ Import NgChartsModule here

@Component({
  standalone: true,
  imports: [NgChartsModule],
  selector: 'app-job-chart',
  templateUrl: './job-chart.component.html',
})
export class JobChartComponent implements OnChanges {
  @Input() jobData: any[] = [];

  public locationChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'] }]
  };

  public locationChartType: ChartType = 'pie';

   public postedDaysChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'] }]
  };

  public postedDaysChartType: ChartType = 'bar';

  public barChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  indexAxis: 'y', // 🔁 This switches to horizontal bars
  scales: {
    x: {
      beginAtZero: true
    },
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      display: false,
      position: 'top'
    },
    tooltip: {
      enabled: true
    }
  }
};

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  ngOnChanges(): void {
    if (this.jobData.length > 0) {
      this.prepareLocationChart();
      this.preparePostedDaysChart();
    }
  }

  prepareLocationChart(): void {
    const locationMap = new Map<string, number>();
    this.jobData.forEach(job => {
      const loc = job.location || 'Unknown';
      locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
    });

    this.locationChartData.labels = Array.from(locationMap.keys());
    this.locationChartData.datasets[0].data = Array.from(locationMap.values());
  }

  preparePostedDaysChart(): void {
    const postedDaysMap = new Map<string, number>();
    this.jobData.forEach(job => {
      const loc = job.posted || 'Unknown';
      postedDaysMap.set(loc, (postedDaysMap.get(loc) || 0) + 1);
    });

    this.postedDaysChartData.labels = Array.from(postedDaysMap.keys());
    this.postedDaysChartData.datasets[0].data = Array.from(postedDaysMap.values());
  }
}
