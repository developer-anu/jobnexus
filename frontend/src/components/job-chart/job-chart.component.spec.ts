import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobChartComponent } from './job-chart.component';

describe('JobChartComponent', () => {
  let component: JobChartComponent;
  let fixture: ComponentFixture<JobChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
